import { useState, useRef, useEffect } from 'react';

function Menu({props}) {
    const [text, setText] = useState("");
    const [properties, setProperties] = useState(props);

    const search = (items, searchParams, query) => {
        return items.filter((item) => {
            let show = false
            searchParams.forEach((param) => {
                if (param === "artist-name") {
                    show = show || item.artists.map((artist) => { return artist.name }).join("").includes(query)
                }
                else if (typeof item[param] === 'string') {
                    show = show || item[param].includes(query)
                }
                else {
                    show = show || item[param] === query
                }
            })
            return show
         })
    } 
    
    const handleChange = (e) => {
        setText(e.target.value)
        setProperties({...properties, item: search(props.item, ["name", "artist-name"], e.target.value)})
    }

    const handleKeyDown = async(e) => {
        if (e.keyCode == 13) {
            setText(e.target.value)
            setProperties({...properties, item: search(props.item, ["name", "artist-name"], e.target.value)})
        }
    }

    const renderSwitchParam = (param) => {
        switch (props.type) {
            case "add-song": return <div className="Content"><AddSongContent props={properties}></AddSongContent></div>
        }
    }

    const buildLeftButtons = () => {
        let buttons = []
        props.buttons.forEach((button) => {

        })
        const closeProps = {
            title: "Close",
            onClick: props.close
        }
        buttons.push(<Button props={closeProps}></Button>)
        return buttons
    }

    return (
        <div className={`Menu-Container ${props.type}`}>
            <div className="Title" onClick={props.close}>{props.title}</div>
            {
                props.search ? <div className='Search'>
                    <input 
                            type="text"
                            value={text}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            className='Search-Input'
                            placeholder='Search...'
                        ></input>
                    </div> : 
                    undefined
            }
            {renderSwitchParam(props.type)}
            <div className="Buttons">
                <div className="Left-Buttons">
                    {buildLeftButtons()}
                </div>
            </div>
        </div>
    )
}

function Button({props}) {
    return (<div className="Button" onClick={props.onClick}>{props.title}</div>)
}
  
function AddSongContent({props}) {
    const songs = props.item
    let songComps = []
    songs.forEach((song) => {
        songComps.push(
            <div className='Add-Song-Card' 
                onClick={() => {
                    props.close(); 
                    props.callback([song])}
                }>
                <div className='Add-Song-Title'>{song.name}</div>
                <div className='Add-Song-Artist'>{song.artists.map((artist) => artist.name).join(", ")}</div>
            </div>
        )
    })
    return (
        <div className="Menu-Content">{songComps}</div>
    )
}

export function create(props) {
    return <Menu props={props}></Menu>
}