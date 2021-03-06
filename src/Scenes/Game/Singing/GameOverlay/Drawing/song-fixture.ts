import { Song } from 'interfaces';

const song: Song = {
    artist: 'E2E Test',
    title: 'MultiTrack',
    video: 'mcEVAY1H5As',
    gap: 1000,
    bpm: 200,
    bar: 4,
    tracks: [
        {
            sections: [
                {
                    type: 'notes',
                    start: 0,
                    notes: [
                        {
                            type: 'normal',
                            start: 5,
                            length: 10,
                            pitch: 9,
                            lyrics: 'Second ',
                        },
                        {
                            type: 'star',
                            start: 20,
                            length: 10,
                            pitch: 10,
                            lyrics: 'Third ',
                        },
                    ],
                },
                {
                    type: 'notes',
                    start: 40,
                    notes: [
                        {
                            type: 'normal',
                            start: 50,
                            length: 10,
                            pitch: 11,
                            lyrics: 'Fourth ',
                        },
                        {
                            type: 'normal',
                            start: 80,
                            length: 10,
                            pitch: 9,
                            lyrics: 'Seventh ',
                        },
                    ],
                },
                {
                    start: 100,
                    end: 120,
                    type: 'pause',
                },
                {
                    type: 'notes',
                    start: 130,
                    notes: [
                        {
                            type: 'normal',
                            start: 140,
                            length: 10,
                            pitch: 10,
                            lyrics: 'Eight ',
                        },
                    ],
                },
            ],
        },
        {
            sections: [
                {
                    type: 'notes',
                    start: 0,
                    notes: [
                        {
                            type: 'normal',
                            start: 5,
                            length: 10,
                            pitch: 11,
                            lyrics: 'First ',
                        },
                        {
                            type: 'normal',
                            start: 16,
                            length: 9,
                            pitch: 9,
                            lyrics: 'Second ',
                        },
                        {
                            type: 'normal',
                            start: 30,
                            length: 10,
                            pitch: 10,
                            lyrics: 'Third ',
                        },
                    ],
                },
                {
                    type: 'notes',
                    start: 50,
                    notes: [
                        {
                            type: 'normal',
                            start: 60,
                            length: 10,
                            pitch: 11,
                            lyrics: 'Fourth ',
                        },
                        {
                            type: 'normal',
                            start: 75,
                            length: 10,
                            pitch: 12,
                            lyrics: 'Fifth ',
                        },
                        {
                            type: 'normal',
                            start: 90,
                            length: 10,
                            pitch: 9,
                            lyrics: 'Seventh ',
                        },
                    ],
                },
                {
                    start: 110,
                    end: 130,
                    type: 'pause',
                },
                {
                    type: 'notes',
                    start: 140,
                    notes: [
                        {
                            type: 'normal',
                            start: 150,
                            length: 10,
                            pitch: 9,
                            lyrics: 'Eight ',
                        },
                        {
                            type: 'normal',
                            start: 165,
                            length: 10,
                            pitch: 10,
                            lyrics: 'Nine ',
                        },
                    ],
                },
            ],
        },
    ],
};

export default song;
