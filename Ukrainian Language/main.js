Game.registerMod("Ukrainian Language",{
	init:function(){
        let MOD=this;
		MOD.prefs=[];

        //Langs.FR = {file:'FR',nameEN:'Ukrainian',name:'Українська',changeLanguage:'Мова',icon:0,w:1};
        Langs.EN = {file:'EN',nameEN:'Ukrainian',name:'Українська',changeLanguage:'Мова',icon:0,w:1};
        if(locId == "EN"){
            formatLong=[' тисяч',' мільйонів',' мільйярдів',' трильйонів',' квадрильйонів',' квінтильйонів',' секстильйонів',' септильйонів',' октильйонів',' нонільйонів'];
            prefixes=['','un','duo','tre','quattuor','quin','sex','septen','octo','novem'];
            suffixes=['decillion','vigintillion','trigintillion','quadragintillion','quinquagintillion','sexagintillion','septuagintillion','octogintillion','nonagintillion'];
            for (var i in suffixes)
            {
                for (var ii in prefixes)
                {
                    formatLong.push(' '+prefixes[ii]+suffixes[i]);
                }
            }
            numberFormatters=
            [
                formatEveryThirdPower(formatShort),
                formatEveryThirdPower(formatLong),
                rawFormatter
            ];
            var adaptWidth=function(node)
			{
				var el=node.firstChild;
				var width=el.clientWidth;
				if (el.classList.contains('subButton'))
				{
					if (width/95>1) el.style.padding='6px 0px';
				}
				width=width/95;
				if (width>1)
				{
					el.style.fontSize=(parseInt(window.getComputedStyle(el).fontSize)*1/width)+'px';
					el.style.transform='scale(1,'+(width)+')';
				}
			}
            l('prefsButton').firstChild.innerHTML="Опції";
			l('statsButton').firstChild.innerHTML="Статистика";
			l('logButton').firstChild.innerHTML="Інформація";
			l('legacyButton').firstChild.innerHTML="Спадщина";
			adaptWidth(l('prefsButton'));
			adaptWidth(l('statsButton'));
			adaptWidth(l('logButton'));
			l('checkForUpdate').childNodes[0].textContent="Нове оновлення!";
			l('buildingsTitle').childNodes[0].textContent="Будівлі";
			l('storeTitle').childNodes[0].textContent="Крамниця";
            Game.bakeryNameRefresh=function()
		    {
		    	var name=Game.bakeryName;
		    	name=loc("%1's bakery",name);
		    	Game.bakeryNameL.textContent=name;
		    	name=Game.bakeryName.toLowerCase();
		    	if (name=='orteil') Game.Win('God complex');
		    	if (!App && name.indexOf('saysopensesame',name.length-('saysopensesame').length)>0 && !Game.sesame) Game.OpenSesame();
		    	Game.recalculateGains=1;
		    }

            Beautify=function(val,floats)
		    {
		    	var negative=(val<0);
		    	var decimal='';
		    	var fixed=val.toFixed(floats);
		    	if (floats>0 && Math.abs(val)<1000 && Math.floor(fixed)!=fixed) decimal=','+(fixed.toString()).split('.')[1];
		    	val=Math.floor(Math.abs(val));
		    	if (floats>0 && fixed==val+1) val++;
		    	//var format=!EN?2:Game.prefs.format?2:1;
		    	var format=Game.prefs.format?2:0;
		    	var shortFormat=format?0:MOD.prefs.short?0:1;
		    	var formatter=numberFormatters[format+shortFormat];
		    	var output=(val.toString().indexOf('e+')!=-1 && format==2)?val.toPrecision(3).toString():formatter(val).toString()
		    	output=output.replace('.',',');
		    	output=output.replace(/\B(?=(\d{3})+(?!\d))/g,'');
		    	//var output=formatter(val).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
		    	if (output=='0') negative=false;
		    	return negative?'-'+output:output+decimal;
		    }
        
		    //Override to add Dots as thousand seperators
		    SimpleBeautify=function(val)
		    {
		    	var str=val.toString();
		    	var str2='';
		    	for (var i in str)//add dots
		    	{
		    		if ((str.length-i)%3==0 && i>0) str2+='.';
		    		str2+=str[i];
		    	}
		    	return str2;
		    }
        
		    drawCookieAmount = function(){
		    	if (!Game.OnAscend){	
                
		    		var str=Beautify(Math.round(Game.cookiesd));
		    		if (Game.cookiesd>=1000000)//dirty padding
		    		{
		    			var decPos=str.indexOf(',');
		    			var decAmount=(decPos!=-1)?str.match(/(?<=,)\d*/)[0].length:0;
		    			var nrmAmount=str.match(/(([\d]+[.]*)+)/)[0].length;
		    			//thousands position so that long scale doesn't have too many digits
		    			var thsPos=str.lastIndexOf('.');
		    			var add='';
		    			if (thsPos==-1)
		    			{
		    				if (decAmount==0) add+=',000';
		    				else
		    				{
		    					if (decAmount==1) add+='00';
		    					if (decAmount==2) add+='0';
		    				}
		    			}
		    			str=[str.slice(0,(decPos!=-1)?nrmAmount+decAmount+1:nrmAmount+1),add,str.slice((decPos!=-1)?nrmAmount+decAmount+1:nrmAmount+1)].join('');
		    		}
                
		    		str=loc("%1 cookie",{n:Math.round(Game.cookiesd),b:str});
		    		if (str.length>14) str=str.replace(' ','<br>');
                
		    		if (Game.prefs.monospace) str='<span class="monospace">'+str+'</span>';
		    		str+=l('cookiesPerSecond').outerHTML;
		    		l('cookies').innerHTML=str;
		    		Timer.track('cookie amount(mod)');
		    }}
		    //Add Hook
		    Game.registerHook('draw', drawCookieAmount);
        }
    }
});