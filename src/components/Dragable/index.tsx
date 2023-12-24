// components/DraggableWidget.tsx

import { MouseEvent, useEffect, useState } from "react"
import css from "./style.module.css"

type DraggableWidgetProps = {
    children: React.ReactNode
    title: string
    closable?: boolean
}

const DraggableWidget = ({ children, title, closable }: DraggableWidgetProps) => {
    const [isDragging, setIsDragging] = useState(false)
    const [position, setPosition] = useState<{ x: number; y: number }>(() => {
        const storedPosition = localStorage.getItem("position")
        if (storedPosition) {
            return JSON.parse(storedPosition)
        }
        return { x: 0, y: 0 }
    })
    const [startPosition, setStartPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
    const [closed, setClosed] = useState<boolean>(false)

    const handleMouseDown = (e: MouseEvent) => {
        e.preventDefault()
        const targetClassList = (e.target as HTMLElement).classList
        if (targetClassList.contains(css.draggableArea)) {
            setIsDragging(true)
            setStartPosition({ x: e.clientX, y: e.clientY })
            console.log("dragging")
        } else {
            console.log("targetClassList", targetClassList)
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - startPosition.x
                const deltaY = e.clientY - startPosition.y
                const newPosition = { x: position.x + deltaX, y: position.y + deltaY }
                setPosition(newPosition)
                localStorage.setItem("position", JSON.stringify(newPosition))
                setStartPosition({ x: e.clientX, y: e.clientY })
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            // @ts-ignore
            window.addEventListener("mousemove", handleMouseMove)
            window.addEventListener("mouseup", handleMouseUp)
        } else {
            // @ts-ignore
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }

        return () => {
            // @ts-ignore
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, position, startPosition])

    if (closed) return null

    return (
        <div className={css.draggableWrapper} style={{ transform: `translate(${position.x}px, ${position.y}px)` }}>
            <div className={css.draggableArea} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                <h4>{title}</h4>
                {closable && (
                    <div className={`absoluteRight margin-right-5px material-symbols-rounded`} onClick={() => setClosed(true)}>
                        close
                    </div>
                )}
            </div>
            {children}
        </div>
    )
}

export default DraggableWidget
