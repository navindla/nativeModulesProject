
  const renderTeamAItem = ({ item, index }) => (
    <View
      style={[
        styles.tmplyrlft,
      //  getBorderStyle(), // Assuming you have a function to determine border styles
      ]}
    >
      <View style={styles.plyrlft}>
        <View 
        >
          <Avatar
            avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
            rounded
            source={{
              uri: item.imageId === ""
                ? "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/dummy.png"
                : `https://cdn.sportmonks.com/images/cricket/players/${item.imageId}`,
            }}
            size={48}
          />  
          {/* Player Role Icons */}
          {item.playerRoleType === "0" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/bat10.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
          {item.playerRoleType === "1" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/bat10.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
          {item.playerRoleType === "2" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/alrounder.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
          {item.playerRoleType === "3" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/cricketBall.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
          {item.playerRoleType === "4" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/wicketKeepr.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
          {item.playerRoleType === "5" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/alrounder.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
          {item.playerRoleType === "6" && (
            <Image
              source={{ uri: "https://player6sports.s3.ap-south-1.amazonaws.com/pl6Asserts/alrounder.png" }}
              style={iconStyle(item.playerRoleType)}
            />
          )}
        </View>
  
        <View style={{ marginTop: 5, width:'100%', flexDirection:'row', justifyContent:'center' , marginRight : 5}}>
          <Text style={[styles.ortxt, styles.plyrtm, styles.plyrsd, ]}>
            {item.teamName}
          </Text>
        </View>
      </View>
  
      <View style={[styles.dotp, styles.dotp2]}>
        <Image style={styles.dotimg} source={BorderLine2} />
      </View>
  
      <View>
        <Text
          style={[styles.teamnm, styles.wnrtxt, styles.tmname, styles.plyrname]}
        >
          {item.name}
        </Text>
        <Text style={[styles.teamnm, styles.plyrruns]}>Avg : {item.avg}</Text>
        <Text style={[styles.ortxt, styles.plyrruns]}>HS : {item.hs}</Text>
      </View>
  
      <TouchableOpacity
        style={[
          styles.adplyr,
          {
            backgroundColor:
              item.isSel == "1" && isOpponent && item.selBy == userInfo?.userId
                ? "orange"
                : item.isSel == "1" &&
                  !isOpponent &&
                  item.selBy == userInfo?.userId
                ? "#246afe"
                : item.isSel == "1" &&
                  isOpponent &&
                  item.selBy != userInfo?.userId
                ? "#246afe"
                : item.isSel == "1" &&
                  !isOpponent &&
                  item.selBy != userInfo?.userId
                ? "orange"
                : "grey",
          },
        ]}
        disabled={item.isSel == "1"}
        onPress={() => {
          Functions.getInstance().fireAdjustEvent("pogpop");
          Functions.getInstance().fireFirebaseEvent(
            "Players11SelectionPlusButton"
          );
          let properties = new MoEProperties();
          properties.addAttribute("clicked", true);
          ReactMoE.trackEvent("LIVE Player Selection", properties);
          console.log('item.playerRoleType :',item.playerRoleType)
         // handlePlayerClick(index, 1, item);
        }}
      >
        {item.isSel == "1" ? (
          <Image style={{ width: 8, height: 8 }} source={TickIcon} />
        ) : (
          <Image style={styles.adplusimg} source={PlusIcon} />
        )}
      </TouchableOpacity>
    </View>
  );

  const iconStyle = (roleType) => ({
    width: roleType === "3" ? 16 : 18,
    height: roleType === "3" ? 16 : 18,
    position: "absolute",
    bottom: 0,
    left: 42,
  });
