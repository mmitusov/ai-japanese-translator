import React from 'react'
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import KanjiDropdownStyles from '@/styles/kanjiDropdown.module.scss'

interface KanjiDropdownProps {
    setDropdownValue(value: string): void;
}

const options = [
    'Kanji', 'Furigana', 'Romaji'
];
const defaultOption = options[0];

const KanjiDropdown: React.FC<KanjiDropdownProps> = ({setDropdownValue}) => {
  return (
    <div>
        <Dropdown 
            options={options} 
            value={defaultOption} 
            placeholder="Select an option" 
            onChange={(e) => setDropdownValue(e.value)} 
            className={`${KanjiDropdownStyles.dropdown}`}
        />
    </div>
  )
}

export default KanjiDropdown