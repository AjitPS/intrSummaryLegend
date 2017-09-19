
 function getInteractiveSummaryLegend(GeneView_fullText) {
  var evidences_rows= GeneView_fullText.split("\n");
console.log("evidences_rows: "+ evidences_rows);

  var evidencesArr= new Array();
  for(var i=1; i < evidences_rows.length; i++) {
      var evi_value= evidences_rows[i].split("\t")[9];
console.log("evi_value: "+ evi_value);
      if(evi_value !== "") {
         evidencesArr.push(evi_value);
        }
     }
console.log("getInteractiveSummaryLegend()>> evidencesArr: "+ evidencesArr);

  var evidences_Summary= new Array();
  // Iterate through evidences and get counts for each evidence Concept Type.
  for(var i=0; i < evidencesArr.length; i++) {
      var row_values= evidencesArr[i];
      row_values= row_values.split("||");
console.log("row_values: "+ row_values);
      for(var j=0; j < row_values.length; j++) {
          var evidence_elements= row_values[j].split("//");
          // add to Array evidence_elements[0] & length-1
          var conType= evidence_elements[0];
          var conCount= evidence_elements.length-1;
console.log("conType: "+ conType +", conCount= "+ conCount);
          if(evidences_Summary[conType] === null) {
             evidences_Summary[conType]= conCount;
            }
          else {
           var val= evidences_Summary[conType];
           evidences_Summary[conType]= val + conCount;
          }
        }
     }
console.log("evidences_Summary: "+ evidences_Summary);

  var legend= '<div id="evidenceSummary2" class="evidenceSummary" title="Click to filter by type">';
  // Display evidence icons with count and name in legend.
  /*
  if(evidence_elements[0] !== "Trait") {
     evidence = evidence+'<div class="evidence_item evidence_item_'+evidence_elements[0]+'" title="'+evidence_elements[0]+'" ><span class="dropdown_box_open" id="evidence_box_open_'+values[1].replace(".","_")+evidence_elements[0]+'">'+((evidence_elements.length)-1)+'</span>';
    }
  else { // For Trait, display tooltip text as GWAS instead.
      evidence = evidence+'<div class="evidence_item evidence_item_'+evidence_elements[0]+'" title="GWAS" ><span class="dropdown_box_open" id="evidence_box_open_'+values[1].replace(".","_")+evidence_elements[0]+'">'+((evidence_elements.length)-1)+'</span>';
     }
*/  
  legend= legend +'</div>';
  return legend;
 }
