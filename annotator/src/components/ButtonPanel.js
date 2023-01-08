import {IconButton} from '@mui/material';
import {Preview,ZoomIn,CropFree,ZoomOut,Close, CancelOutlined, HelpOutline, Style} from '@mui/icons-material';
import {ArrowUpward, ArrowDownward, ArrowBack, ArrowForward} from '@mui/icons-material';
import {Label, LabelOff} from '@mui/icons-material';
import React from 'react';

const ButtonPanel = ({func, labelVisibility}) => {
    return (
        <>
           <IconButton onClick={func.show_regions} sx={{color: 'white'}} title="Show Regions"><Preview/></IconButton>
            <IconButton onClick={func.zoom_in} sx={{color: 'white'}}  title="Zoom In"><ZoomIn/></IconButton>
            <IconButton onClick={func.zoom_out} sx={{color: 'white'}}  title="Zoom Out"><ZoomOut/></IconButton>
            <IconButton onClick={func.zoom_reset} sx={{color: 'white'}}  title="Zoom Reset"><CropFree/></IconButton>
            <IconButton onClick={()=>func.move_selected("ArrowUp", 10)} sx={{color: 'white'}}  title="Move Up"><ArrowUpward/></IconButton>
            <IconButton onClick={()=>func.move_selected("ArrowDown", 10)} sx={{color: 'white'}}  title="Move Down"><ArrowDownward/></IconButton>
            <IconButton onClick={()=>func.move_selected("ArrowLeft", 10)} sx={{color: 'white'}}  title="Move Left"><ArrowBack/></IconButton>
            <IconButton onClick={()=>func.move_selected("ArrowRight", 10)} sx={{color: 'white'}}  title="Clear Right"><ArrowForward/></IconButton>
            <IconButton onClick={func.delete_selected} sx={{color: 'white'}}  title="Clear Selected"><Close/></IconButton>
            <IconButton onClick={func.show_label} sx={{color: 'white'}}  title="Label Visibility">{labelVisibility?<LabelOff/>:<Label/>}</IconButton>
            <IconButton onClick={func.label_type} sx={{color: 'white'}}  title="Label type"><Style/></IconButton>
            <div style={{flex: 1}}></div>
            <IconButton onClick={func.show_help} sx={{color: 'white'}} title="Help"><HelpOutline/></IconButton>
            <IconButton onClick={func.clear_all} sx={{color: 'white'}} title="Clear All"><CancelOutlined/></IconButton>  
        </>
    );
};
export default ButtonPanel;