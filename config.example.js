
//
// For variable naming convention see https://emagnusandersson.com/prefixes_to_variables
//


app=globalThis

app.intDDOSMax=200; // intDDOSMax: How many requests before DDOSBlocking occurs. 
app.tDDOSBan=5; // tDDOSBan: How long in seconds till the blocking is lifted
app.intDDOSIPMax=100; // intDDOSIPMax: How many requests before DDOSBlocking occurs. 
app.tDDOSIPBan=10; // tDDOSIPBan: How long in seconds till the blocking is lifted


googleSiteVerification='googleXXXXXXXXXXXXXXXX.html'; // If you use google.com/webmasters



//
// Endpoint urls for the IdP.
//
strFBVersion="v20.0"
UrlOAuth={fb:`https://www.facebook.com/${strFBVersion}/dialog/oauth`, google:"https://accounts.google.com/o/oauth2/v2/auth"}
UrlToken={fb:`https://graph.facebook.com/${strFBVersion}/oauth/access_token`, google:"https://accounts.google.com/o/oauth2/token"}
UrlGraph={fb:`https://graph.facebook.com/${strFBVersion}/me`, google:"https://www.googleapis.com/plus/v1/people/me"};
strIPPrim='fb';


  //
  // These variables are not realy configuration variables they are just variables in the examples below: 
  //

var strWhichBrowser="Which browser is best? (OpenID-voting)";
var arrOptionBrowser=['Chrome', 'Firefox', 'Opera', 'Safari', 'IE' ];
var strWhichStarWars="Which Star Wars episode is best? (Facebook-voting)";
var arrOptionStarWars=['I (1999)', 'II (2002)', 'III (2005)', 'IV (1977)', 'V (1980)', 'VI (1983)'];
var strWhichDrink="Which drink taste best? (Google-voting)";
var arrOptionDrink=['Tea', 'Coffee', 'Water', 'Beer', 'Orange Juice', 'Milk', 'Milk Chocolate', 'Wine', 'Vodka', 'Whisky'];
var strWhichSmartphone="Which Smartphone is best? (IP-voting)";
var arrOptionSmartphone=['Android', 'iOS', 'Blackberry', 'Windows mobile', 'Symbian', 'Palm OS', 'Bada', 'Linux (other than Android)'];




boUseLastWriteNow=false;// Using last write time (of userTab) instead of "now()" in db-queries. 
                        // Note, if boUseSnapShot (below) is true then boUseLastWriteNow is ignored.
boUseSnapShot=false;    // Using snapShot table.
ageMaxSnapShot=24*3600; // Max age of snapshot

  //
  //  Since one might want use the software on several different infrastrucures (heroku.com, appfog.com, digitalocean.com, localhost ...),
  //  then I personally use an environment variable "strInfrastructure" on respective site, set to either to 'heroku', 'af', 'do' or nothing assigned (localhost)
  //  This way one can use the same config file for all the infrastructures.
  //

if(process.env.strInfrastructure=='heroku'){ // heroku.com

    // UriDB: an object storing database urls
  UriDB={ 
    //exampleDB:"mysql://user:password@host/database?reconnect=true" 
  }
    // If you added the ClearDB-database on the heroku.com-interface then that one is added as "default".
  if('CLEARDB_DATABASE_URL' in process.env) UriDB.default=process.env.CLEARDB_DATABASE_URL;


    // Heroku uses the environment variable "PORT" to store the port used:
  port = parseInt(process.env.PORT, 10); 


    // RootDomain: an object to store app credetials from IPs (identity providers) and other data to the root domain (I'm using the term "root domain" for Second level domains (xxx.xxx))
 
    // Each "key" is the name of the root domain (which will for example be used to reference
    // it (like in the "Site"-variable below.))
    // fb: Facebook variables (See more on developer.facebook.com)
    // google: Google variables (See more on googles pages)
  RootDomain={
    exampleDomain:{
      //idplace:{id: "XXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}, 
      //google:{id: "X", secret:"XXXXXXXXXXXXXXXXXXXXXXXX"},
      fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
    },
    yourDomain:{fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}},
    herokuappCom:{fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"}}
  }


    // Site: An assoc-array of (object) "site" (instances) (each representing a voting (a referendum)) (written in
    // JSON syntax) Each "key" (like "demoFB" below) is the name of the site (which will for example be used in
    // database-table-names etc.)
    // db: key into "UriDB" (above)
    // wwwSite: A string to determine which site each incomming request belongs to.
    //   (Note: if the request-url matches multiple entries then the first one is used
    //   Ex: if you have one referendum at "example.com" and an other at "example.com/abc" then "example.com/abc" 
    //   should come first.)
    //     Note! "www" is my special notation see more https://emagnusandersson.com/myNodeApps_notation 
    // strRootDomain: a key into RootDomain (above)
    // googleAnalyticsTrackingID: Needed if you use Google Analytics  
    // typeApp: either "fb", "oi", "google" or "ip". How to identify users (Facebook, OpenID, Google or IP-address)
    // boOpenVote: (true or false). If voters should be listable.
    // strTitle: Text in title-tag.
    // strH1: Text in h1-tag.
    // metaDescription: Text in meta description.
    // Option: An array of options.
  

  var wwwTmp="YOURDOMAIN.COM"; // just a temprary variable
  Site={
    demoOI:{
      wwwSite:"demoOI."+wwwTmp, strRootDomain:"yourDomain", googleAnalyticsTrackingID:"", db:"default", typeApp:'oi',boOpenVote:1, boTLS:0,
      strTitle:strWhichBrowser, strH1:strWhichBrowser, metaDescription:strWhichBrowser,
      Option:arrOptionBrowser
    },
    demoFB:{
      wwwSite:"demoFB."+wwwTmp, strRootDomain:"yourDomain", googleAnalyticsTrackingID:"", db:"default", typeApp:'fb',boOpenVote:1, boTLS:0,
      strTitle:strWhichStarWars, strH1:strWhichStarWars, metaDescription:strWhichStarWars,
      Option:arrOptionStarWars
      //,strFirstSort:'nVote',     boAscFirstSort:0
    },
    demoGoogle:{
      wwwSite:"demoGoogle."+wwwTmp, strRootDomain:"yourDomain", googleAnalyticsTrackingID:"", db:"default", typeApp:'google',boOpenVote:1, boTLS:0,
      strTitle:strWhichDrink, strH1:strWhichDrink, metaDescription:strWhichDrink,
      Option:arrOptionDrink
    },
    demoIP:{
      wwwSite:"demoIP."+wwwTmp, strRootDomain:"yourDomain", googleAnalyticsTrackingID:"", db:"default", typeApp:'ip',boOpenVote:0, boTLS:0,
      strTitle:strWhichSmartphone, strH1:strWhichSmartphone, metaDescription:strWhichSmartphone,
      Option:arrOptionSmartphone
    }
  }


    // If levelMaintenance=1 then site visitors gets a "Down for maintenance"-message
  //LevelMaintenance={ demoOI:0, demoFB:0, demoGoogle:0, demoIP:0};
  levelMaintenance=0;

}
else if(process.env.strInfrastructure=='af'){ // appfog.com

     // If you added the MySql-database on the appfog.com-interface then an entry "default" is added to   "UriDB".
  if('VCAP_SERVICES' in process.env) {
      var tmp=process.env.VCAP_SERVICES, services_json = JSON.parse(tmp);
      var mysql_config = services_json["mysql-5.1"][0]["credentials"];
      var sqlUserName = mysql_config["username"];
      var sqlPassword = mysql_config["password"];
      var sqlHost = mysql_config["hostname"];
      var portTmp = mysql_config["port"];
      var sqlDBName = mysql_config["name"];
      UriDB.default=`mysql://${sqlUserName}:${sqlPassword}@${sqlHost}/${sqlDBName}?reconnect=true`;
  }
  port = parseInt(process.env.VCAP_APP_PORT, 10);

  RootDomain={
    afGavottCm:{
      fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
      google:{id:"X",secret:"X",redir:'http://YOURAPP.eu01.aws.af.cm/loginReturn'}
    }
  }
  Site={
    nsvTest:{
      wwwSite:"YOURAPP.eu01.aws.af.cm", strRootDomain:"afGavottCm", googleAnalyticsTrackingID:"UA-00000000-00", db:"default", typeApp:"fb", boOpenVote:1, boTLS:0,
      strTitle:"Is this software any good?", strH1:"Is this software any good?", metaDescription:"Is this software any good?",
      Option:["yes", "no"]
    }
  }


  //LevelMaintenance={ nsvTest:0};
  levelMaintenance=0;

}else if(process.env.strInfrastructure=='do'){  // digitalocean.com
  UriDB={default:'mysql://user:password@localhost/database'};
  port = 8083;  

  RootDomain={
    exampleDomain:   {
      fb:{id:"XXXXXXXXXXXXXXX", secret:"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"},
      google:{id: "", secret:"",redir:'c'}
    }
  }

  Site={
    demoOI:{
      wwwSite:www192+"/demoOI", strRootDomain:"exampleDomain", googleAnalyticsTrackingID:"", db:"default", typeApp:'oi',boOpenVote:1, boTLS:0,
      strTitle:strWhichBrowser, strH1:strWhichBrowser, metaDescription:strWhichBrowser,
      Option:arrOptionBrowser
    }
  }

  //LevelMaintenance={demoOI:0};
  levelMaintenance=0;
}
else {  // localhost
  UriDB={myDB:'mysql://user:password@localhost/database'};

  RootDomain={
    "192Loc":{
      fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
      google:{id:"a",secret:"b",redir:'c'} 
    },
    localhost:{
      fb:{id:"000000000000000", secret:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"},
      google:{id:"X",secret:"X",redir:'http://localhost:5000/loginReturn'}
    }
  }



  var wwwLocalhost="localhost:"+port, www192="192.168.0.3:"+port;  // just some temprary variables

  Site={
    demoOI:{
      wwwSite:www192+"/demoOI", strRootDomain:"192Loc", googleAnalyticsTrackingID:"", db:"myDB", typeApp:'oi',boOpenVote:1, boTLS:0,
      strTitle:strWhichBrowser, strH1:strWhichBrowser, metaDescription:strWhichBrowser,
      Option:arrOptionBrowser
    },
    demoFB:{
      wwwSite:wwwLocalhost+"/demoFB", strRootDomain:"localhost", googleAnalyticsTrackingID:"", db:"myDB", typeApp:'fb',boOpenVote:1, boTLS:0,
      strTitle:strWhichStarWars, strH1:strWhichStarWars, metaDescription:strWhichStarWars,
      Option:arrOptionStarWars,
      strFirstSort:'nVote',
    },
    demoGoogle:{
      wwwSite:wwwLocalhost, strRootDomain:"localhost", googleAnalyticsTrackingID:"", db:"myDB", typeApp:'google',boOpenVote:1, boTLS:0,
      strTitle:strWhichDrink, strH1:strWhichDrink, metaDescription:strWhichDrink,
      Option:arrOptionDrink
    },
    demoIP:{
      wwwSite:www192, strRootDomain:"192Loc", googleAnalyticsTrackingID:"", db:"myDB", typeApp:'ip',boOpenVote:0, boTLS:0,
      strTitle:strWhichSmartphone, strH1:strWhichSmartphone, metaDescription:strWhichSmartphone,
      Option:arrOptionSmartphone
    }
  }


  //LevelMaintenance={demoOI:0, demoFB:0, demoGoogle:0, demoIP:0};
  levelMaintenance=0;

} 

  // If wwwCommon is not set then set it to the first "wwwSite" in "Site"
if(!wwwCommon) {var keys=Object.keys(Site); wwwCommon=Site[keys[0]].wwwSite; } 




  //
  // See also under the "Default config variables" in the script.js-file for more variables that can be configured.
  //


