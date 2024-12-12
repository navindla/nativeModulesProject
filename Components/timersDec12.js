//// useffect respo for set timers


  ////////////// 25nov//////////
  useEffect(() => {
    const ws = new WebSocket(
      `wss://qaws.player6sports.com/${userInfo?.userId}/gameEvents/${UserStore.selectedGameData.gameId}`
    );

    ws.onopen = () => {
      console.log(
        "WebSocket connection established userInfo?.userId",
        userInfo?.userId
      );
    };

    ws.onmessage = (event) => {
      try {
        console.log("-------raw-event triggerrrreeed--", event);
        const parsedData = JSON.parse(event.data);

        // Check if event is "COMPLETED"
        if (parsedData.event === "COMPLETED") {
          console.log("Events completed...");
          setSelectionProcess(true);
          return; // Exit early since no further processing is needed
        }

        // Extract and set the new state variables
        const myStatusData = parsedData.data?.myStatus;
        const opnStatusData = parsedData.data?.opnStatus;
        const myFinalData = parsedData.data?.myFinal;
        const opFinalData = parsedData.data?.opFinal;

        ////////////////// test2 hit passed /////////// gID 5897
        ///// PART-1 ////
        const nextPickTimeStr = myStatusData?.next_picked_player; // Example value "2024-12-11
        console.log("---event timers started----", nextPickTimeStr);
        //// PART-2 /////////
        const now = new Date();
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(now.getUTCDate()).padStart(2, "0");
        const hours = String(now.getUTCHours()).padStart(2, "0");
        const minutes = String(now.getUTCMinutes()).padStart(2, "0");
        const seconds = String(now.getUTCSeconds()).padStart(2, "0");
        const now_time = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        //////// OPR //////////////
        const nextPickTime = new Date(nextPickTimeStr.replace(" ", "T")); // Convert to ISO format
        const nowTime = new Date(now_time.replace(" ", "T")); // Convert to ISO format
        //////////// CAL ////////////////////////////////
        // Calculate the difference in seconds
        const timeDifferenceInSeconds = String(
          Math.floor((nextPickTime - nowTime) / 1000)
        ); // Log the result
        console.log("MAIN------------Next Pick Time API:", nextPickTimeStr);
        console.log("MAIN------------Current Time:", now_time);
        console.log(
          "MAIN------------Time Difference (in seconds):",
          timeDifferenceInSeconds
        );

        const minutes1 = "00";
        setCurrentTime(`${minutes1}:${timeDifferenceInSeconds}`);

        // Set myStatus based on userId comparison
        if (myStatusData && userInfo?.userId === myStatusData.userId) {
          console.log("My Status:", myStatusData);
          setMyStatus(myStatusData);
          setMyFinal(myFinalData); // Update the state with myFinal data
          setOpFinal(opFinalData); // Update the state with opFinal data
        } else if (opnStatusData) {
          console.log("Opponent Status:", opnStatusData);
          setMyStatus(opnStatusData); // Set opponent status if userId doesn't match
          setMyFinal(opFinalData); // Update the state with myFinal data
          setOpFinal(myFinalData); // Update the state with opFinal data
        }

        // Update globalList with both final data arrays
        if (myFinalData || opFinalData) {
          setglobal_6players([...(myFinalData || []), ...(opFinalData || [])]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Clean up WebSocket on component unmount
    return () => {
      ws.close();
    };
  }, []);
