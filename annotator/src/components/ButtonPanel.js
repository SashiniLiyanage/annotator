import {IconButton, Tooltip, Divider} from '@mui/material';
import {Preview,ZoomIn,CropFree,ZoomOut,Close, CancelOutlined, HelpOutline, Style} from '@mui/icons-material';
import {ArrowUpward, ArrowDownward, ArrowBack, ArrowForward, Opacity, Check, AddAPhoto} from '@mui/icons-material';
import {Label, LabelOff} from '@mui/icons-material';
import React from 'react';

const ButtonPanel = ({func, labelVisibility, setImageSrc}) => {

    const loadFile = (event)=> {
        if(event.target.files.length===0) return;
        setImageSrc(URL.createObjectURL(event.target.files[0]))
    };

    return (
        <>
            <Tooltip title="Show Regions" placement="bottom-end" arrow><IconButton onClick={func.show_regions} sx={{color: 'white'}}><Preview/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>
            <Tooltip title="Finish Drawing" placement="bottom-end" arrow><IconButton onClick={func.finish_drawing} sx={{color: 'white'}}><Check/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>
            
            <Tooltip title="Zoom In" placement="bottom-end" arrow><IconButton onClick={func.zoom_in} sx={{color: 'white'}}><ZoomIn/></IconButton></Tooltip>
            <Tooltip title="Zoom Out" placement="bottom-end" arrow><IconButton onClick={func.zoom_out} sx={{color: 'white'}}><ZoomOut/></IconButton></Tooltip>
            <Tooltip title="Zoom Reset" placement="bottom-end" arrow><IconButton onClick={func.zoom_reset} sx={{color: 'white'}}><CropFree/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>
            
            <Tooltip title="Move Up" placement="bottom-end" arrow><IconButton onClick={()=>func.move_selected("ArrowUp", 10)} sx={{color: 'white'}}><ArrowUpward/></IconButton></Tooltip>
            <Tooltip title="Move Down" placement="bottom-end" arrow><IconButton onClick={()=>func.move_selected("ArrowDown", 10)} sx={{color: 'white'}}><ArrowDownward/></IconButton></Tooltip>
            <Tooltip title="Move Left" placement="bottom-end" arrow><IconButton onClick={()=>func.move_selected("ArrowLeft", 10)} sx={{color: 'white'}}><ArrowBack/></IconButton></Tooltip>
            <Tooltip title="Clear Right" placement="bottom-end" arrow><IconButton onClick={()=>func.move_selected("ArrowRight", 10)} sx={{color: 'white'}}><ArrowForward/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>

            <Tooltip title="Clear Selected" placement="bottom-end" arrow><IconButton onClick={func.delete_selected} sx={{color: 'white'}}><Close/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>

            <Tooltip title="Toggle Label Visibility" placement="bottom-end" arrow><IconButton onClick={func.show_label} sx={{color: 'white'}}>{labelVisibility?<LabelOff/>:<Label/>}</IconButton></Tooltip>
            <Tooltip title="Toggle Label Type" placement="bottom-end" arrow><IconButton onClick={func.label_type} sx={{color: 'white'}}><Style/></IconButton></Tooltip>
            <Tooltip title="Toggle Label Opacity" placement="bottom-end" arrow><IconButton onClick={func.opacity_change} sx={{color: 'white'}}><Opacity/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>
            <Tooltip title='Add Image' placement="bottom-end" arrow><IconButton sx={{color: 'white'}} aria-label="upload picture" component="label">
                <input hidden name="files[]" accept='.jpg,.jpeg,.png' type="file" onChange={(event)=>loadFile(event)}/>
                <AddAPhoto/>
            </IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>

            <div style={{flex: 1}}></div>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>
            <Tooltip title="Help" placement="bottom-end" arrow><IconButton onClick={func.show_help} sx={{color: 'yellow'}}><HelpOutline/></IconButton></Tooltip>
            <Divider orientation="vertical" variant="middle" flexItem color='gray'/>
            <Tooltip title="Clear All" placement="bottom-end" arrow><IconButton onClick={func.clear_all} sx={{color: 'red'}}><CancelOutlined/></IconButton></Tooltip>
        </>
    );
};
export default ButtonPanel;