// Dropdown.js
import React, { useEffect, useRef, useState } from "react"
import styles from "./style.module.css"

const Dropdown = ({ items }: any) => {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const dropdownRef = useRef<HTMLDivElement | null>(null)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }
    const closeDropdown = () => {
        setIsOpen(false)
    }
    const handleItemClick = (item: any) => {
        setSelectedItem(item)
        setIsOpen(false)
    }
    const handleOutsideClick = (event: any) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick)

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])
    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <div className={styles.dropdownButton} onClick={toggleDropdown}>
                <div className={styles.dropdownButtonText}> {selectedItem || "Select an Item"}</div>
            </div>
            {isOpen && (
                <ul className={styles.dropdownMenu} onClick={closeDropdown}>
                    {items.map((item: any, index: any) => (
                        <li key={index} className={`${styles.dropdownItem} ${selectedItem === item ? styles.selected : ""}`} onClick={() => handleItemClick(item)}>
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Dropdown
