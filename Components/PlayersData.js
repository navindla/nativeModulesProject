  const playersData = (item) => {
    const { item: player, isOpponent } = item; 
    const {
      image,
      draftId,
      playerRoleType,
      name,
      country,
      countryType,
      avg,
      hs,
    } = player;
  
    const playerImage = `https://player6sports.s3.us-east-1.amazonaws.com/Players/${image}`;
    const localDummyImage = require("./Icons/bat.png"); // Ensure you have a local image in your assets folder.
  
    const handlePick = () => {
      Vibration.vibrate(400);
      onPicked(player, draftId === ""); 
    };
  
    const roleIcons = {
      0: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/bat10.png",
      1: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/bat10.png",
      2: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
      3: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/cricketBall.png",
      4: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/wicketKeepr.png",
      5: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
      6: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/alrounder.png",
    };
  
    return (
      <View
        style={[
          styles.plyrmain,
          isOpponent
            ? { flexDirection: "row", justifyContent: "space-between", borderWidth: 1, borderColor: draftId !== "" ? "#e79013" : "black" }
            : { flexDirection: "row", justifyContent: "space-between", borderWidth: 1, borderColor: draftId !== "" ? "#279bff" : "black" }
        ]}
        key={image}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: 28,
            width: 80,
          }}
        >
          <TouchableOpacity onPress={() => selectedPlayerData(player)}>
            <Iconicons2 name="information-variant" size={20} color="#fff" />
          </TouchableOpacity>
  
          <Pressable style={{ marginLeft: 5 }} onPress={handlePick}>
            <Image
              style={{height:48,width:48, borderRadius:48}}
              source={{ uri: playerImage }}
              onError={(e) => {
                e.target.setNativeProps({ src: [{ uri: "https://player6sports.s3.us-east-1.amazonaws.com/pl6Assets/dummy.png" }] });
              }}
              size={48}
            //  onError={(e) => (e.target.src = localDummyImage)} // Fallback to local image
            />
  
            {roleIcons[playerRoleType] && (
              <Image source={{ uri: roleIcons[playerRoleType] }} style={iconStyle(playerRoleType)} />
            )}
          </Pressable>
        </View>
        <Pressable onPress={handlePick} style={[styles.plyrtxt, { marginRight: 7 }]}>
          <Text style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname, { fontFamily: "Poppins-Medium" }]}>
            {name}
          </Text>
          <Text style={[styles.ortxt, styles.plyrtm, countryType == 1 ? null : { color: "#2d2d2d", backgroundColor: "#fff", fontSize: 7.7 }]}>
            {country}
          </Text>
        </Pressable>
  
        <Pressable onPress={handlePick} style={{ width: 50, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
          <Text style={[styles.ortxt]}>{avg}</Text>
        </Pressable>
  
        <Pressable onPress={handlePick} style={{ width: 50, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
          <Text style={[styles.ortxt]}>{hs}</Text>
        </Pressable>
  
        <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={handlePick}>
          {draftId !== "" ? (
            <IconFeathr style={{ color: isOpponent === true ? "#e79013" : "#279bff" }} name="minus-circle" size={20} color="#fff" />
          ) : (
            <IconFeathr style={{ color: isOpponent === true ? "#e79013" : "#279bff" }} name="plus" size={20} />
          )}
        </Pressable>
      </View>
    );
  };
