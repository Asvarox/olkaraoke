import { navigate } from 'hooks/useHashLocation';
import { useEffect, useState } from 'react';
import useSongList from './useSongList';
import { useSongSelectionKeyboardNavigation } from './useSongSelectionKeyboardNavigation';

export default function useSongSelection(preselectedSong: string | null) {
    const { songList, groupedSongList, filtersData, setFilters, filters } = useSongList();

    const [keyboardControl, setKeyboardControl] = useState(true);

    const [focusedSong, setFocusedSong, showFilters, setShowFilters] = useSongSelectionKeyboardNavigation(
        keyboardControl,
        groupedSongList,
        () => setKeyboardControl(false),
    );

    useEffect(() => {
        if (songList && songList[focusedSong]) navigate(`/game/${encodeURIComponent(songList[focusedSong].file)}`);
    }, [focusedSong, songList]);

    useEffect(() => {
        if (songList && preselectedSong) {
            const newIndex = songList.findIndex((song) => song.file === preselectedSong);

            if (newIndex > -1) setTimeout(() => setFocusedSong(newIndex));
        }
    }, [songList, preselectedSong]);

    const songPreview = songList?.[focusedSong];
    return {
        groupedSongList,
        focusedSong,
        setFocusedSong,
        setKeyboardControl,
        keyboardControl,
        songPreview,
        songList: songList ?? [],
        filtersData,
        filters,
        setFilters,
        showFilters,
        setShowFilters,
    };
}
