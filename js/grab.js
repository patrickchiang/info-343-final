// STEP 1: LOAD JQUERY
var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

// WAIT A FEW SECONDS BEFORE COPY PASTING THE REST

// STEP 2: DONE
var json = [];

// Get links, remove irrelevant links
$("body > a").not(".navlink").each(function(iout){
    var linkName = $(this).attr("href");
    
    // Paste pages to end of page
    $.get(linkName, function(data) {
        $("html").append("<div class=\"" + linkName.substring(2, linkName.length - 5) +"\">" + data + "</div>");
        // Get rows
        var classes = {};
        var pageDiv = "." + linkName.substring(2, linkName.length - 5);
        var rows = $(pageDiv + " table tbody tr");
        
        classes.name = $(pageDiv + " h1").html();
        classes.instructor = $(pageDiv + " h2").html().split(" &nbsp;&nbsp;")[0];
        classes.quarter = $(pageDiv + " h2").html().split("&nbsp;&nbsp; ")[1];
        
        rows.each(function(index){
            if (index > 0){
                var item = $(this).html() + " td";
                var rowName = "";
                $(item).each(function(i2){
                    if (i2 == 0){
                        rowName = $($(item)[i2]).html().trim();
                        classes[rowName] = [];
                    } else if (i2 > 0 && i2 < 8) {
                        classes[rowName].push(parseInt($($(item)[i2]).html().trim()));
                    }
                });
            }
        });
        json.push(classes);
    });
});