
import Services from '../../../Services/Services';
import React, { useState, useEffect } from 'react';"react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import IconAnt from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from '@react-navigation/native';
import ImagePicker from "react-native-image-crop-picker";

const ContactUsScreen = ({userInfo}) => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [items, setItems] = useState([
    { label: "Deposit", value: "Deposite" },
    { label: "Withdrawal", value: "Withdrawal" },
    { label: "Promotion", value: "Promotion" },
    { label: "Game issue", value: "Game issue" },
    { label: "Match settlement", value: "Match settlement" },
    { label: "feedback", value: "feedback" },
  ]);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  // const [email, setEmail] = useState(`SUBJECT: ${selectedOption} DESCRIPTION: ${description}`);

  // const handleSubmit = () => {
  //   if (!selectedOption || !description.trim()) {
  //     alert("Please select a category and enter a description.");
  //     return;
  //   }
  //   alert("Submitted successfully!");
  //   navigation.goBack();
  // };


  
// const handleSubmit = () => {
//   if (!selectedOption || !description.trim()) {
//     Alert.alert("Error", "Please select a category and enter a description.");
//     return;
//   }
//   onpreser

//   Alert.alert(
//     "Success",
//     "Submitted successfully!",
//     [
//       {
//         text: "OK",
//         onPress: () => navigation.goBack(),
//       },
//     ],
//     { cancelable: false } // Prevents dismissing by tapping outside the alert
//   );
// };


useEffect(() => {
  // Update email when selectedOption or description changes
  setEmail(`SUBJECT: ${selectedOption || ''}     DESCRIPTION: ${description}`);
}, [selectedOption, description]);



const handleImagePicker = async () => {
  try {
    const image = await ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    });
    setSelectedImage(image.path);
  } catch (error) {
    console.log("Image selection cancelled", error);
  }
};

const handleSubmit = () => {
  console.log("Selected option:", email);
  if (!selectedOption || !description.trim() || !selectedImage) {
    Alert.alert("Error", "Please select a category, enter a description, and choose an image.");
    return;
  }

  const obj = {
    message : email
}
Services.getInstance().contactSupportTeam(obj, userInfo.userId, userInfo.accesToken).then((result)=>{
    console.log('----------------------',result);
    if(result.status == 200){
        setMessage("");
       Functions.getInstance().Toast("success", "Thank you for your feedback. Our support team will be reaching out to you soon.");
    }
    else{
        Functions.getInstance().Toast("error", "Unable to submit the feedback now, Please try again later");
    }
    hideProgress();
})

  // Submit Logic Here

  Alert.alert(
    "Success",
    "Submitted successfully!",
    [{ text: "OK", onPress: () => navigation.goBack() }],
    { cancelable: false }
  );
};


  const contactSupportTeam = () =>{
    if(message == ""){
        setErrorMessage("Please Enter Message");
    }
    else{
        setErrorMessage("");
        showProgress();
        const obj = {
            message : message
        }
        Services.getInstance().contactSupportTeam(obj, userInfo.userId, userInfo.accesToken).then((result)=>{
            console.log('----------------------',result);
            if(result.status == 200){
                setMessage("");
               Functions.getInstance().Toast("success", "Thank you for your feedback. Our support team will be reaching out to you soon.");
            }
            else{
                Functions.getInstance().Toast("error", "Unable to submit the feedback now, Please try again later");
            }
            hideProgress();
        })
    }

  }


  
  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={[styles.card, open && styles.activeCard]}>
        <Text style={styles.label}>Select a Category</Text>
        <DropDownPicker
          open={open}
          value={selectedOption}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedOption}
          setItems={setItems}
          placeholder="Choose an option"
          containerStyle={{ width: "100" }}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropDownContainer}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Describe Your Issue</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter details here..."
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={()=> handleImagePicker()} style={[styles.attachmentButton, {right:0, flexDirection:'row', alignItems:'center'}]} >
          <IconAnt name="attach-email" size={22} color="#007bff" />
          <Text style={[styles.buttonText, {marginLeft:5}]}>Add Attachment</Text>
        </TouchableOpacity>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        )}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor:'black'
   // backgroundColor: "#f4f4f4",
  },
  card: {
    backgroundColor: "#28282B",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
    zIndex: 1,
  },
  activeCard: {
    zIndex: 1000,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color:'#fff'
  },
  dropdown: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
  },
  dropDownContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    zIndex: 1000,
    elevation: 5,
  },
  input: {
    color:'black',
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    height: 150,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: 'column',
   // alignItems: "center",
    justifyContent: "space-between",
  },
  attachmentButton: {
    padding: 10,
  },
  button: {
    width:'100%',
    backgroundColor: "#007bff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  previewImage: {
    width: 40,
    height: 50,
    marginTop: 1,
    borderRadius: 0,
    marginLeft: 5,
    marginBottom:6
  //  alignSelf: "center",
  },
});

export default ContactUsScreen;
