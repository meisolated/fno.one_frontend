import { useEffect, useState } from "react"
import { capitalizeFirstLetter } from "../../helper"
import css from "./style.module.css"
interface props {
    label: string
    itemsList: Array<string>
    selectionChanged: any
}
export default function Selector({ label, itemsList, selectionChanged }: props) {
    const [items, setItems] = useState(itemsList)
    const [selectedItem, setSelectedItem] = useState(items[0])
    function onSelectionChange(item: any) {
        setSelectedItem(item)
        selectionChanged(item)
    }
    useEffect(() => {
        setItems(itemsList)
        setSelectedItem(itemsList[0])
        selectionChanged(itemsList[0])
    }, [itemsList])
    return (
        <div className={css.selectorWrapper}>
            {label}
            <div className={css.selectorList}>
                {items.map((item: any, indexKey: any) => {
                    return (
                        <div className={`${item == selectedItem ? css.selectorButton : css.selectorButtonActive}`} key={indexKey} onClick={() => onSelectionChange(item.toLowerCase())}>
                            {capitalizeFirstLetter(item)}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
