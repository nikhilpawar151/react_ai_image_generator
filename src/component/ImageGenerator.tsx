import { Box, IconButton, LinearProgress, Snackbar, TextField } from '@mui/material'
import React, {useRef, useState} from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Typography from '@mui/material/Typography';
import dummy_image from '../assets/image-editing.png';

type myStates = {
  showError : boolean,
  errorMessage : string,
  isLoading : boolean,
  imageUrl : string
}

const ImageGenerator = () => {
  const inputField = useRef<HTMLInputElement | null>(null)
  const [appState, setAppState] = useState<myStates>({showError : false, errorMessage : "", isLoading : false, imageUrl : dummy_image})


  const displayError = (message : string) => {
    setAppState({...appState, showError : true, errorMessage : message})
  }

  const generateImage = async() =>{
    if(inputField.current){
      const value: string = inputField.current.value;
      if(value === "")
        displayError("Please enter search query");
      else{
        setAppState({...appState, isLoading : true, imageUrl : dummy_image })
        let response = await fetch("https://api.openai.com/v1/images/generations", {
          method : "POST", 
          headers : {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_TOKEN_HERE",
            "User-Agent" : "Chrome"
          },
          body : JSON.stringify({
            prompt : value,
            n : 1,
            size : '512x512'
          })
        });
        let data = await response.json()
        console.log(data)
        let url = data.data[0].url
        setAppState({...appState, imageUrl : url, isLoading : false})
      }
        
    }

  }

  return (
    <div className="main">
        <Box className="mainBox" >
            <Typography variant="h4" sx={{mb : '2rem'}} align='center'>AI Image Generator</Typography>
            <div className="inputField">
                <TextField inputRef={inputField} variant='outlined' size='small' label="Search Query" className='textQuery' color='primary'/>
                <IconButton className='searchIcon' onClick={generateImage}  sx={{background : '#FFFFFF', marginLeft : '1rem'}}>
                    <SearchIcon/>
                </IconButton>
            </div>

            <img src={appState.imageUrl} alt="" className='imageItem' />

            {appState.isLoading && <Box sx={{width : '100%'}}>
              <LinearProgress />
            </Box>}
        </Box>
        <Snackbar open={appState.showError} autoHideDuration={6000} message={appState.errorMessage} onClose={() => setAppState({...appState, showError : false})} />
    </div>
  )
}

export default ImageGenerator