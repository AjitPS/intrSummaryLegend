
function createGenesTable(tableUrl, rows){
	var table = "";
	//tableUrl= "D://GitHub_repos//intrSummaryLegend//testData//"+ tableUrl +".tab";
	tableUrl= "http://localhost:8000/testData/"+ tableUrl +".tab";
  //  console.log("Selected dataset: "+ tableUrl);
  //  console.log("rows= "+ rows);
	$.ajax({
        url: tableUrl,
        type:'GET',
        dataType:'text',
        async: true,
        timeout: 1000000,
        error: function(){
        },
        success: function printGenesTable(text){
    		var candidate_genes = text.split("\n");
    		var results = candidate_genes.length-2;
                
    		if(candidate_genes.length > 2) {
		        table =  '';
				// Gene View: interactive summary legend for evidence types.
				var interactive_summary_Legend= getInteractiveSummaryLegend(text);
				
				table = table + '<p class="margin_left"><br/><span id="hintSortableTable" class="hint hint-small" ></span></p>';
				table = table + '<form name="checkbox_form">';
				table = table + 'Max number of genes to show: ';
				table = table + '<select value="'+rows+'" id="numGenes">';
				table = table + '<option value="50">50</option>';
				table = table + '<option value="100">100</option>';
				table = table + '<option value="200">200</option>';
				table = table + '<option value="500">500</option>';
				table = table + '<option value="1000">1000</option>';
				table = table + '<select>';
				table = table + '<br><br>';
				// dynamic Evidence Summary to be displayed above Gene View table
			//	table = table + interactive_summary_Legend;
				table = table + '<div id="evidence_Summary_Legend" class="evidenceSummary">'+ interactive_summary_Legend + '<input id="revertGeneView" type="button" value="Undo All" title= "Revert all filtering changes"></div>';
				table = table + '<div id= "geneViewTable" class = "scrollTable">';
				table = table + '<table id = "tablesorter" class="tablesorter">';
				table = table + '<thead>';
				table = table + '<tr>';
			var values = candidate_genes[0].split("\t");
				table = table + '<th width="100">'+values[1]+'</th>';
				table = table + '<th width="100" title="Show '+ values[2] +', if not same as '+ values[1]+'">'+values[2]+'</th>'; // added Gene Name to Gene View table
				table = table + '<th width="60">'+values[3]+'</th>';
				table = table + '<th width="70">'+values[4]+'</th>';

				table = table + '<th width="70">'+values[6]+'</th>';
				table = table + '<th width="70">'+values[8]+'</th>';
				table = table + '<th width="220">'+values[9]+'</th>';
				table = table + '<th width="70">Select</th>';
				table = table + '</tr>';
				table = table + '</thead>';
				table = table + '<tbody class="scrollTable">';

				//this loop iterates over the full table and prints the
				//first n rows + the user provided genes
				//can be slow for large number of genes, alternatively server
				//can filter and provide smaller file for display
				for(var i=1; i<=results; i++) {
					var values = candidate_genes[i].split("\t");

					if(i>rows /*&& values[7]=="no"*/){
						continue;
					}
		        	table = table + '<tr>';

				    var gene_Acc= values[1];
					var gene_Name= values[2]; // display both accession & gene name.
					
                                    // Fetch preferred concept (gene) name and use the shorter name out of the two.
                                /*    if(gene_Acc.length > gene_Name.length) {
                                       gene_Acc= gene_Name;
                                      }*/
                                    // gene_Name to display in Gene View table (under Accession).
                                    var gene = '<td>'+gene_Acc+'</td>';
									var geneName = '<td>'+gene_Name+'</td>'; // geneName
                                    if(gene_Name.toLowerCase() === gene_Acc.toLowerCase()) {
                                       geneName = '<td></td>'; // don't display geneName, if identical to Accession
                                      }

				    var taxid = '';
					var chr = '<td>'+values[3]+'</td>';
					var start = '<td>'+values[4]+'</td>';
					var score = '<td>'+values[6]+'</td>'; // score

				// QTL column with information box
                    var withinQTL = '<td>';
				    if(values[8].length > 1){
				    	var withinQTLs = values[8].split("||");
				    	//Shows the icons
				    	withinQTL = '<td><div class="qtl_item qtl_item_'+withinQTLs.length+'" title="'+withinQTLs.length+' QTLs"><a href"javascript:;" class="dropdown_box_open" id="qtl_box_open_'+values[1].replace(".","_")+withinQTLs.length+'">'+withinQTLs.length+'</a>';

				    	//Builds the evidence box
				    	//withinQTL = withinQTL+'<div id="qtl_box_'+values[1].replace(".","_")+withinQTLs.length+'" class="qtl_box" style="display:none"><a class="qtl_box_close" href="javascript:;" onclick="$(\'#qtl_box_'+values[1].replace(".","_")+withinQTLs.length+'\').slideUp(100);"></a>';
				    	withinQTL = withinQTL+'<div id="qtl_box_'+values[1].replace(".","_")+withinQTLs.length+'" class="qtl_box"><span class="dropdown_box_close" id="qtl_box_close_'+values[1].replace(".","_")+withinQTLs.length+'"></span>';
				    	withinQTL = withinQTL+'<p><span>'+"QTLs"+'</span></p>';

				    	var uniqueQTLs = new Object();
				    	var uniqueTraits = new Object();

				    	for (var count_i = 0; count_i < withinQTLs.length; count_i++) {
				    		var withinQTL_elements = withinQTLs[count_i].split("//");
				    		if (withinQTL_elements[1].length > 0) {
				    			if (uniqueTraits[withinQTL_elements[1]] == null)
				    				uniqueTraits[withinQTL_elements[1]] = 1;
				    			else
				    				uniqueTraits[withinQTL_elements[1]] = uniqueTraits[withinQTL_elements[1]] + 1;
				    		}
				    		else {
				    			if (uniqueQTLs[withinQTL_elements[0]] == null)
				    				uniqueQTLs[withinQTL_elements[0]] = 1;
				    			else
				    				uniqueQTLs[withinQTL_elements[0]] = uniqueQTLs[withinQTL_elements[0]] + 1;
				    		}
				    	}

				    	var unique = "";
				    	for (var count_i = 0; count_i < withinQTLs.length; count_i++) {
				    		var withinQTL_elements = withinQTLs[count_i].split("//");
				    		if (withinQTL_elements[1].length > 0) {
				    			if (unique.indexOf(withinQTL_elements[1] + ";") == -1) {
				    				unique = unique + withinQTL_elements[1] + ";";
					    			withinQTL = withinQTL+'<p>'+ uniqueTraits[withinQTL_elements[1]] + ' ' + withinQTL_elements[1]+'</p>';
					    		}
				    		}
				    		else {
				    			if (unique.indexOf(withinQTL_elements[0] + ";") == -1) {
				    				unique = unique + withinQTL_elements[0] + ";";
					    			withinQTL = withinQTL+'<p>'+ uniqueQTLs[withinQTL_elements[0]] + ' ' + withinQTL_elements[0]+'</p>';
					    		}
				    		}
				    	}
				    }
				    else {
				    	withinQTL = withinQTL+'0';
				    }
				    withinQTL = withinQTL + '</td>';

					// For each evidence show the images - start
					var evidence = '<td>';
					var values_evidence = values[9];
					var evidences = values_evidence.split("||");
					if(evidences.length >0){
						for (var count_i = 0; count_i < (evidences.length); count_i++) {
							//Shows the icons
							var evidence_elements = evidences[count_i].split("//");
							if(evidence_elements[0] !== "Trait") {
							   evidence = evidence+'<div class="evidence_item evidence_item_'+evidence_elements[0]+'" title="'+evidence_elements[0]+'" ><span class="dropdown_box_open" id="evidence_box_open_'+values[1].replace(".","_")+evidence_elements[0]+'">'+((evidence_elements.length)-1)+'</span>';
							  }
							else { // For Trait, display tooltip text as GWAS instead.
							   evidence = evidence+'<div class="evidence_item evidence_item_'+evidence_elements[0]+'" title="GWAS" ><span class="dropdown_box_open" id="evidence_box_open_'+values[1].replace(".","_")+evidence_elements[0]+'">'+((evidence_elements.length)-1)+'</span>';
							  }
						       evidence = evidence+'</div>';
						       evidence = evidence+'</div>';
						}
					}
					evidence = evidence+'</td>';

				    var select = '<td><input id="checkboxGene_'+i+'" type="checkbox" name= "candidates" value="'+values[1]+'"></td>';
					table = table + gene + geneName + taxid + chr + start + score + /*usersList +*/ withinQTL + evidence + select;
				    table = table + '</tr>';
				}
                table = table+'</tbody>';
		        table = table+'</table></div>';
		        table = table + '</form>';
    		}

                table = table + '</insert>';

    		document.getElementById('resultsTable').innerHTML = table;
                
                // display dynamic Evidence Summary legend above the Gene View table as well.
            //    var evidences_legend= $("#evidenceSummary1").html();
            //    $("#evidenceSummary2").html(evidences_legend);
			
    		$("#tablesorter").tablesorter({
    	        headers: {
    	            // do not sort "select" column
                /*  5: {sorter:"digit"},*/
                  4: {sorter:"digit"}, /* sort by SCORE column by default */
    	            8: {sorter: false}
    	        }
    	    });

    		$("#numGenes").change(function(e){
    		  printGenesTable(text);	//if number of genes to show changes, redraw table.
    		});
			
			/*
			 * Revert Evidence Filtering changes
			*/
			$("#revertGeneView").click(function(e) {
			//  console.log("Revert Gene View...");
              printGenesTable(text); // redraw table
			});

            
		}
		});

}
