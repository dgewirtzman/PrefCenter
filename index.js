document.addEventListener('DOMContentLoaded', (event) => {

    const apiKey = 'c58b4c4135694c5084763be62d5d0b0a'
    const hmacKey = '1234567890'

    //function to get parameters from url
    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    // const emailAddress = decodeURIComponent('dgewirtzman%40playbill.com')
    // const iterableHash = 'fdd66f8606c9b77d4ef5323405021a4fdfbcd273'
    const emailAddress = getUrlVars()["email"];
    const iterableHash =  getUrlVars()["sig"];
    console.log(emailAddress)
    console.log(iterableHash)

    //id numbers for email lists

    const playbillPostListID = 58473
    const clubListID = 58202
    const classicArtsListID = 67556


    //function to create HMAC-SHA1 hash

    function hashChecker(hashTest) {
        var shaObj = new jsSHA("SHA-1", "TEXT");
        shaObj.setHMACKey(hmacKey, "TEXT");
        shaObj.update(emailAddress);
        var hmac = shaObj.getHMAC("HEX");
        if (hmac === iterableHash) {
            return true
        } else {
            return false
        }
    }

    //function to check boxes for the lists the user is subscribed to

    function identifyLists(json) {
        const emailLists = json.user.dataFields.emailListIds
        emailLists.forEach( list => {
            if (list === playbillPostListID) {
                 document.getElementById("playbillPost").checked = true;
            }
            if (list === clubListID) {
                document.getElementById("club").checked = true;
            }
            if (list === classicArtsListID) {
                document.getElementById("classicArts").checked = true;
            }
        } )
    }


    //function to build new sub/unsub lists, based on checkboxes (**only adds or removes items based on checkboxes)

    function updateSubList(subArray, unsubArray) {
        //if Playbill Post box is checked
        if (document.getElementById("playbillPost").checked === true) {
            //if not included in list of subscriptions, add it
            if (subArray.includes(playbillPostListID) === false) {
                subArray.push(playbillPostListID)
                console.log("post-1")
            }
            //if included in the list of unsubscribed emails, remove it
            if (unsubArray.includes(playbillPostListID) === true) {
                unsubArray.splice(unsubArray.indexOf(playbillPostListID), 1)
                console.log("post-2")
            }
        //if Playbill Post box is unchecked
        } else {
            //if included in list of subscriptions, remove it
            if (subArray.includes(playbillPostListID) === true) {
                subArray.splice(subArray.indexOf(playbillPostListID), 1)
                console.log("post-3")
            }
            //if not included in the list of unsubscribed emails, add it
            if (unsubArray.includes(playbillPostListID) === false) {
                unsubArray.push(playbillPostListID)
                console.log("post-4")
            }
        }

        //if Club box is checked
        if (document.getElementById("club").checked === true) {
            //if not included in list of subscriptions, add it
            if (subArray.includes(clubListID) === false) {
                subArray.push(clubListID)
                console.log("club-1")
            }
            //if included in the list of unsubscribed emails, remove it
            if (unsubArray.includes(clubListID) === true) {
                unsubArray.splice(unsubArray.indexOf(clubListID), 1)
                console.log("club-2")
            }
            //if Playbill Post box is unchecked
        } else {
            //if included in list of subscriptions, remove it
            if (subArray.includes(clubListID) === true) {
                subArray.splice(subArray.indexOf(clubListID), 1)
                console.log("club-3")
            }
            //if not included in the list of unsubscribed emails, add it
            if (unsubArray.includes(clubListID) === false) {
                unsubArray.push(clubListID)
                console.log("club-4")
            }
        }

        //if ClassicArts box is checked
        if (document.getElementById("classicArts").checked === true) {
            //if not included in list of subscriptions, add it
            if (subArray.includes(classicArtsListID) === false) {
                subArray.push(classicArtsListID)
                console.log("class-1")
            }
            //if included in the list of unsubscribed emails, remove it
            if (unsubArray.includes(classicArtsListID) === true) {
                unsubArray.splice(unsubArray.indexOf(classicArtsListID), 1)
                console.log("class-2")
            }
            //if Playbill Post box is unchecked
        } else {
            //if included in list of subscriptions, remove it
            if (subArray.includes(classicArtsListID) === true) {
                subArray.splice(subArray.indexOf(classicArtsListID), 1)
                console.log("class-3")
            }
            //if not included in the list of unsubscribed emails, add it
            if (unsubArray.includes(classicArtsListID) === false) {
                unsubArray.push(classicArtsListID)
                console.log("class-4")
            }
        }
    }

    //check to make sure hash passes test
    let hashCheck = hashChecker()
    if (hashCheck === true) {
        //api call to get user data from iterable
        fetch(`https://api.iterable.com:443/api/users/${emailAddress}?api_key=${apiKey}`)
            .then(response => response.json())
            .then(responseJson => {
                identifyLists(responseJson)
                document.addEventListener('submit', (event) => {
                    event.preventDefault()
                    let subscribedEmails = responseJson.user.dataFields.emailListIds
                    let unsubscribedEmails = responseJson.user.dataFields.unsubscribedChannelIds

                    //adjust subscribe and unsubscribe lists based on checkboxes
                    updateSubList(subscribedEmails, unsubscribedEmails)

                    //send updates lists to iterable
                    fetch(`https://api.iterable.com/api/users/updateSubscriptions?api_key=${apiKey}`, {
                        method: "post",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: emailAddress,
                            emailListIds: subscribedEmails,
                            unsubscribedChannelIds: unsubscribedEmails
                        })
                    })
                        .then( (response) => {
                            console.log(response)
                        });


                })

                })
    } else {
        document.getElementById('errorMessage').innerHTML = 'Error! Invalid Email Address';
    }

        })





