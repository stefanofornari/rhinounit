// safe, strict access to jsUnitParmHash
function jsUnitGetParm(name)
{
    if (typeof(top.jsUnitParmHash[name]) != 'undefined')
    {
        return top.jsUnitParmHash[name];
    }
    return null;
}

function jsUnitParseParms(string)
{
    var i;
    var searchString = unescape(string);
    var jsUnitParmHash = new Object();

    if (!searchString)
    {
        return jsUnitParmHash;
    }

    i = searchString.indexOf('?');
    if (i != -1)
    {
        searchString = searchString.substring(i+1);
    }

    var parmList     = searchString.split('&');
    var a;
    for (i = 0; i < parmList.length; i++)
    {
        a = parmList[i].split('=');
        a[0] = a[0].toLowerCase();
        if (a.length > 1)
        {
            jsUnitParmHash[a[0]] =  a[1];
        }
        else
        {
            jsUnitParmHash[a[0]] =  true;
        }
    }
    return jsUnitParmHash;
}

function jsUnitConstructTestParms()
{
    var p;
    var parms = '';

    for (p in jsUnitParmHash)
    {
        var value = jsUnitParmHash[p];

        if (!value ||
            p == 'testpage' ||
            p == 'autorun'  ||
            p == 'submitresults' ||
            p == 'showtestframe' ||
            p == 'resultid')
            {
            continue;
        }

        if (parms)
        {
            parms += '&';
        }

        parms += p;

        if (typeof(value) != 'boolean')
        {
            parms += '=' + value;
        }
    }
    return escape(parms);
}