// ==UserScript==
// @name         HEAT User parse
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://oxford.saasiteu.com/*
// @grant        none
// ==/UserScript==


console.log("HEAT Hack");

var heatHack = window.heatHack = {};



function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function getAuthToken()
{
 var regx = /(ReSA=)([\w]*)(;)/;
    var x = document.cookie;

    return regx.exec(x)[2];
}
var authToken = getAuthToken();

			function getName(userName)
			{
					var myRequest = new XMLHttpRequest();

					myRequest.onload = function(e) {
						//console.log(myRequest.response);
                        if (myRequest.response && myRequest.response.d.data && myRequest.response.d.data.length>0)
                        {
                            console.log(myRequest.response.d.data[0]);
                            console.log(heatHack.divs);

                            for (i=0;i< heatHack.divs.length;i++)
                            {
                                console.log('text:'+heatHack.divs[i].innerText + 'Login ID'+ myRequest.response.d.data[0].LoginID);
                                if (heatHack.divs[i].innerText == myRequest.response.d.data[0].LoginID)
                                {
                                    heatHack.divs[i].innerText = myRequest.response.d.data[0].DisplayName;
                                    heatHack.divs.remove(heatHack.divs[i]);
                                }
                            }

                        }
					}

					myRequest.open('post','https://oxford.saasiteu.com/Services/FormService.asmx/GetLinkFieldPrompts');
					myRequest.setRequestHeader('Content-Type','application/json');
					myRequest.responseType = 'json';
					myRequest.send(JSON.stringify({"ownerTableRef": "Incident#",
						 "linkObjectRef": "Frs_CompositeContract_Contact#",
						"searchText": userName,
						 "maxResult": 1,
						 "useLikeSearch": false,
						  "linkSearchField": null,
							 "doNotSort": false,
							 "relationshipTag": "IncidentAssociatedCustomer",
							 "condition": null,
							 "masterObjectId": "(newcli1)",
							 "masterObjectValues": null,
							 "_authToken": authToken}));
}

window.GM_parseUsers = function()
{



var pageFrames = document.getElementsByTagName('iframe');
    console.log("frames");
    console.log(pageFrames);
//contentDocument.querySelectorAll

    var users = [];
    heatHack.divs = [];

   for (j=0;j<pageFrames.length;j++)
   {
     var framex = pageFrames[j].contentDocument;

       var trs = framex.querySelectorAll('table[class=x-grid3-row-table] td:nth-child(5) div');
       for (var i = 0; i<trs.length;i++)
       {
           var values = trs[i].innerText;
		   if (values != 'No' && values !='InternalServices'){
             // console.log({'value':value,'el':trs[i]});
                users.push(values);
               heatHack.divs.push(trs[i]);

           }
          // users.push({value:value,el:trs[i]});

       }


   }
    console.log("divs");
    console.log(heatHack.divs);
       users = users.getUnique();
    console.log("users");
       console.log(users);

    for(x=0;x<users.length;x++)
    {
        getName(users[x]);
    }

}


setTimeout(function(){
var button = document.createElement('button');
button.setAttribute('id','HH_parseusers');
button.setAttribute('type','button');
button.innerText = 'fetch users';
button.addEventListener("click", GM_parseUsers, false);

document.getElementById('main_body').insertBefore(button,document.getElementById('main_body').firstChild);
}, 10000);
