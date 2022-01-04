import { NotesSection, Section } from "../../../interfaces";

export default function isNotesSection(section: Section | undefined): section is NotesSection {
    return section?.type === 'notes';
}