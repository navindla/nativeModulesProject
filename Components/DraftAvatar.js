/////////// render compo //////////////////////


  const playersData = (item) => {
    return (
      <Pressable>
        <View style={styles.plyrmain} key={item.item.image}>
          <View style={styles.plyrinfo}>
            <Pressable
              style={[styles.plyrprflinfo, styles.srtby]}
              onPress={() => selectedPlayerData(item.item)}
            >
              <Iconicons2
                name="information-variant"
                size={20} // Adjust size as needed
                color="#fff"
                // style={{ position: 'absolute', bottom: 0, left: 40 }}
              />

              <View style={[styles.plyrprflinfo, styles.srtby]}>
                <View>
                  <Avatar
                    avatarStyle={{ borderWidth: 1, borderColor: "#fff" }}
                    rounded
                    source={{
                      uri: item.item.image == "" ?
                        "https://www.wplt20.com/static-assets/images/players/68442.png?v=50.45":  `https://cdn.sportmonks.com/images/cricket/players/${item.item.image}`
                    }}
                    size={50}
                  />

                  
                  <View
                    style={{
                      width: 20, // Outer container width (background circle)
                      height: 20, // Outer container height (background circle)
                      backgroundColor: "white", // Background color (white circle)
                      borderRadius: 10, // Half of the width/height to make it a perfect circle
                      justifyContent: "center", // Center the image vertically
                      alignItems: "center", // Center the image horizontally
                      position: "absolute",
                      bottom: 0,
                      left: 40, // Adjust the position as needed
                      padding: 3, //new
                    }}
                  >
                    <Image
                      source={
                        item.item.name.toLowerCase().startsWith("s")
                          ? require("./Icons/cricketBall.png")
                          : require("./Icons/bat7.png")
                      }
                      style={{
                        width: 14, // Image width
                        height: 14, // Image height
                      }}
                    />
                  </View>
                </View>

                <View style={[styles.plyrtxt, { marginHorizontal: 8 }]}>
                  <Text
                    style={[
                      styles.teamnm,
                      styles.wnrtxt,
                      styles.tmname,
                      styles.plyrname,
                      { fontSize: 8 },
                    ]}
                  >
                    {item.item.name}
                  </Text>
                  <Text style={[styles.ortxt, styles.plyrtm]}>
                    {item.item.country}
                  </Text>
                </View>
              </View>
            </Pressable>

            <View style={[styles.srtby, styles.rnoptn]}>
              <View style={[styles.topo, styles.hdoptns]}>
                <Text style={styles.ortxt}>{item.item.avg}</Text>
              </View>
            </View>
            <View style={[styles.srtby, styles.rnoptn]}>
              <View style={[styles.topo, styles.hdoptns]}>
                <Text style={styles.ortxt}>{item.item.hs}</Text>
              </View>
            </View>
            <>
              {item.item.draftId !== "" ? (
                <Pressable
                  style={[styles.srtby, styles.rnoptn]}
                  onPress={() => {
                    Functions.getInstance().fireAdjustEvent("6qupwl");
                    Functions.getInstance().fireFirebaseEvent(
                      "DraftPickedButton"
                    );
                    let properties = new MoEProperties();
                    properties.addAttribute("clicked", true);
                    ReactMoE.trackEvent("Picked", properties);
                    onPicked(item.item, false);
                  }}
                >
                  <View
                    style={[
                      styles.topo,
                      styles.hdoptns,
                      styles.pkop,
                      styles.alpkd,
                    ]}
                  >
                    <Text style={styles.ortxt}>Picked</Text>
                  </View>
                </Pressable>
              ) : (
                <Pressable
                  style={[
                    { marginLeft: 12 },
                    styles.topo,
                    styles.hdoptns,
                    styles.pkop,
                    isOpponent ? styles.orngpick : {},
                  ]}
                  onPress={() => {
                    Functions.getInstance().fireAdjustEvent("eepdwq");
                    Functions.getInstance().fireFirebaseEvent(
                      "DraftPickButton"
                    );
                    let properties = new MoEProperties();
                    properties.addAttribute("clicked", true);
                    ReactMoE.trackEvent("Pick", properties);
                    onPicked(item.item, true);
                  }}
                >
                  <Image
                    style={[styles.tmsdimg, styles.picon]}
                    source={PlusIcon}
                  />
                  <Text style={styles.ortxt}>Pick</Text>
                </Pressable>
              )}
            </>
          </View>
        </View>
      </Pressable>
    );
  };
