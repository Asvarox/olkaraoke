import { noDistanceNoteTypes } from 'consts';
import { Note, NotesSection, PlayerNote } from 'interfaces';
import getNoteColor from 'Scenes/Game/Singing/GameOverlay/Drawing/Elements/utils/getNoteColor';
import SungTriangle from 'Scenes/Game/Singing/GameOverlay/Drawing/Particles/SungTriangle';
import random from 'utils/randomValue';
import GameState from '../../GameState/GameState';
import GameStateEvents from '../../GameState/GameStateEvents';
import getPlayerNoteDistance from '../../Helpers/getPlayerNoteDistance';
import isNotesSection from '../../Helpers/isNotesSection';
import calculateData, { BIG_NOTE_HEIGHT, DrawingData, NOTE_HEIGHT, pitchPadding } from './calculateData';
import debugPitches from './Elements/debugPitches';
import drawNote from './Elements/note';
import drawPlayerFrequencyTrace from './Elements/playerFrequencyTrace';
import drawPlayerNote from './Elements/playerNote';
import ParticleManager from './ParticleManager';
import ExplodingNoteParticle from './Particles/ExplodingNote';
import FadeoutNote from './Particles/FadeoutNote';
import RayParticle from './Particles/Ray';
import VibratoParticle from './Particles/Vibrato';

function getPlayerNoteAtBeat(playerNotes: PlayerNote[], beat: number) {
    return playerNotes.find((note) => note.start <= beat && note.start + note.length >= beat);
}

export default class CanvasDrawing {
    private loop = false;

    public constructor(private canvas: HTMLCanvasElement) {}
    public start = () => {
        GameStateEvents.sectionChange.subscribe(this.onSectionEnd);
        this.loop = true;

        this.drawFrame();
    };

    public drawFrame = () => {
        const ctx = this.canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < GameState.getPlayerCount(); i++) this.drawPlayer(i, ctx);

        ParticleManager.tick(ctx, this.canvas);

        if (this.loop) window.requestAnimationFrame(this.drawFrame);
    };

    public end = () => {
        this.loop = false;
        GameStateEvents.sectionChange.unsubscribe(this.onSectionEnd);
    };

    private drawPlayer = (playerNumber: number, ctx: CanvasRenderingContext2D) => {
        const drawingData = this.getDrawingData(playerNumber);
        const { currentSection } = calculateData(drawingData);
        if (!isNotesSection(currentSection)) return;

        const displacements = this.calculateDisplacements(currentSection, drawingData);

        this.drawNotesToSing(ctx, drawingData, displacements);
        this.drawSungNotes(ctx, drawingData, displacements);
        this.drawFlare(ctx, drawingData, displacements);

        false && debugPitches(ctx!, drawingData);
    };

    private drawNotesToSing = (
        ctx: CanvasRenderingContext2D,
        drawingData: DrawingData,
        displacements: Record<number, [number, number]>,
    ) => {
        if (!isNotesSection(drawingData.currentSection)) return;

        drawingData.currentSection.notes.forEach((note) => {
            const { x, y, w, h } = this.getNoteCoords(drawingData, note, note.pitch, true, displacements[note.start]);

            drawNote(ctx, x, y, w, note);
        });
    };

    private drawSungNotes = (
        ctx: CanvasRenderingContext2D,
        drawingData: DrawingData,
        displacements: Record<number, [number, number]>,
    ) => {
        if (!isNotesSection(drawingData.currentSection)) return;

        drawingData.currentPlayerNotes.forEach((playerNote) => {
            const distance = getPlayerNoteDistance(playerNote);

            const { x, y, w, h } = this.getNoteCoords(
                drawingData,
                playerNote,
                playerNote.note.pitch + distance,
                distance === 0,
                displacements[playerNote.note.start],
            );
            if (distance > 0 || w > h / 2.5) {
                drawPlayerNote(ctx, x, y, w, drawingData.playerNumber, distance === 0, playerNote);

                if (playerNote.vibrato) {
                    ParticleManager.add(new VibratoParticle(x, y, w, h, drawingData.currentTime));
                }

                if (
                    distance === 0 &&
                    playerNote.frequencyRecords.length > 3 &&
                    !noDistanceNoteTypes.includes(playerNote.note.type)
                ) {
                    drawPlayerFrequencyTrace(ctx, x, y, w, h, playerNote);
                }
            }
        });
    };

    private drawFlare = (
        ctx: CanvasRenderingContext2D,
        drawingData: DrawingData,
        displacements: Record<number, [number, number]>,
    ) => {
        if (!isNotesSection(drawingData.currentSection)) return;

        const lastNote = getPlayerNoteAtBeat(
            drawingData.currentPlayerNotes,
            drawingData.currentBeat - 185 / drawingData.songBeatLength,
        );

        if (lastNote && lastNote.distance === 0) {
            const displacement = displacements[lastNote.note.start] || [0, 0];

            const { x, y, w, h } = this.getNoteCoords(drawingData, lastNote, lastNote.note.pitch, true, displacement);
            const preciseDistance = noDistanceNoteTypes.includes(lastNote.note.type)
                ? 0
                : lastNote.frequencyRecords.at(-1)!.preciseDistance;

            const finalX = x + w;
            const finalY = this.getPreciseY(y, h, preciseDistance);

            ParticleManager.add(new RayParticle(finalX, finalY, drawingData.currentTime, 1));

            ParticleManager.add(
                new SungTriangle(
                    random(Math.max(x, finalX - 50), finalX),
                    finalY,
                    getNoteColor(ctx, drawingData.playerNumber, true, lastNote).fill,
                ),
            );
        }
    };

    private onSectionEnd = (playerNumber: number) => {
        const drawingData = this.getDrawingData(playerNumber, -1);
        if (!isNotesSection(drawingData.currentSection)) return;

        this.fadeoutNotes(drawingData.currentSection, drawingData);
        this.explodeNotes(drawingData.currentSection, drawingData);
    };

    private fadeoutNotes = (section: NotesSection, drawingData: DrawingData) => {
        section.notes.forEach((note) => {
            const { x, y, w, h } = this.getNoteCoords(drawingData, note, note.pitch, true);

            ParticleManager.add(new FadeoutNote(x, y, w, note));
        });
    };

    private explodeNotes = (section: NotesSection, drawingData: DrawingData) => {
        const notesToExplode = drawingData.playerNotes.filter(
            (note) =>
                (note.distance === 0 || noDistanceNoteTypes.includes(note.note.type)) &&
                section.notes.includes(note.note),
        );

        notesToExplode.forEach((note) => {
            const { x, y, w, h } = this.getNoteCoords(drawingData, note, note.note.pitch, true);
            ParticleManager.add(
                new ExplodingNoteParticle(x, y + h / 2, w, drawingData.playerNumber, note.note, ParticleManager),
            );
        });
    };

    private calculateDisplacements = (currentSection: NotesSection, drawingData: DrawingData) => {
        const displacements: Record<number, [number, number]> = {};

        currentSection.notes.forEach((note) => {
            const sungNotesStreak = drawingData.playerNotes
                .filter((sungNote) => sungNote.note.start === note.start)
                .filter(
                    (sungNote) =>
                        sungNote.note.start + sungNote.note.length + 30 >= drawingData.currentBeat &&
                        sungNote.distance === 0,
                )
                .map((sungNote) =>
                    sungNote.start + 30 < drawingData.currentBeat
                        ? sungNote.length - (drawingData.currentBeat - 30 - sungNote.start)
                        : sungNote.length,
                )
                .reduce((currLength, sungNoteLength) => Math.min(currLength + sungNoteLength, 30), 0);

            const displacementRange = Math.max(0, (sungNotesStreak - 5) / (note.type === 'star' ? 3 : 5));
            const displacementX = (Math.random() - 0.5) * displacementRange;
            const displacementY = (Math.random() - 0.5) * displacementRange;

            displacements[note.start] = [displacementX, displacementY];
        });

        return displacements;
    };

    private getDrawingData = (playerNumber: number, sectionShift = 0): DrawingData => {
        const playerState = GameState.getPlayer(playerNumber);
        const currentSectionIndex = playerState.getCurrentSectionIndex() + sectionShift ?? 0;
        const song = GameState.getSong()!;
        const track = playerState.getTrackIndex();
        const currentSection = song.tracks[track].sections[currentSectionIndex];
        const playerNotes = playerState.getPlayerNotes();

        return {
            song,
            songBeatLength: GameState.getSongBeatLength(),
            minPitch: playerState.getMinPitch(),
            maxPitch: playerState.getMaxPitch(),
            canvas: this.canvas,
            currentTime: GameState.getCurrentTime(),
            frequencies: playerState.getPlayerFrequencies(),
            playerNotes,
            currentPlayerNotes: playerNotes.filter((note) => note.note.start >= currentSection.start),
            playerNumber,
            track: playerState.getTrackIndex(),
            regionPaddingTop: playerNumber * this.canvas.height * 0.5,
            regionHeight: this.canvas.height * 0.5,
            currentBeat: GameState.getCurrentBeat(),
            currentSectionIndex,
            currentSection,
        };
    };

    private getNoteCoords = (
        drawingData: DrawingData,
        { start, length }: Pick<Note, 'start' | 'length'>,
        pitch: number,
        big: boolean,
        displacement: [number, number] = [0, 0],
    ) => {
        const regionPaddingTop = drawingData.playerNumber * this.canvas.height * 0.5;

        const { sectionEndBeat, currentSection, paddingHorizontal, pitchStepHeight } = calculateData(drawingData);
        const sectionStart = isNotesSection(currentSection) ? currentSection.notes[0].start : 1;

        const beatLength = (this.canvas.width - 2 * paddingHorizontal) / (sectionEndBeat - sectionStart);

        const [dx, dy] = big ? displacement : [0, 0];
        const pitchY = pitchStepHeight * (drawingData.maxPitch - pitch + pitchPadding);

        return {
            x: Math.floor(paddingHorizontal + beatLength * (start - sectionStart) + dx),
            y: Math.floor(regionPaddingTop + 10 + pitchY + dy - (big ? 3 : 0)),
            w: Math.floor(beatLength * length),
            h: big ? BIG_NOTE_HEIGHT : NOTE_HEIGHT,
        };
    };

    private getPreciseY = (y: number, h: number, preciseDistance: number) => y + h / 2 - (preciseDistance * h) / 3;
}
