new api func


const SubmitFun = async () => {
  try {
  //  showProgress();
  const formData = new FormData();
  formData.append('attachment', {
    uri: selectedImage, // Replace with the actual file path
    type: 'image/jpeg', // MIME type
    name: "photo.jpg"    // File name
  });
  formData.append('message', 'hello world venky test');
  formData.append('subject', 'Deposit');
    console.log(selectedImage)

    console.log(JSON.stringify(formData));
    Services.getInstance().ContactUs(formData, userInfo.userId, userInfo.accesToken).then((result)=>{
      console.log('-----support api response-----',result)
      hideProgress();
     // console.log('-----support api response-----',result)
      if(result.status == 200){
        console.log('-----support api response-----',result)
      }
      else if(result.status == 403){
        if(result.error){
          Functions.getInstance().Toast("error", result.error); 
        }
        else if(result.msg.error){
          Functions.getInstance().Toast("error", result.msg.error); 
        }
        else if(result.msg[0].error){
          Functions.getInstance().Toast("error", result.msg[0].error); 
        }
        else{
          Functions.getInstance().Toast("error", "Please check your details"); 
        }
      }
      else{
       // setNameError('');
        Functions.getInstance().Toast("error", "Please try again later.");
      }
    })
  } catch (error) {
    console.error('API call error:', error);
  //  hideProgress();
  }
};
