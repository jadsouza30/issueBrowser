//captures state of issues being displayed
var params={
  data: {},
  page: 1,
  rowsPerPage: 10,
  filter:"",
  order:"",
  low:0,
  high:0,
  max:100
};



function loadData(){
  //data already in cahce
  if(params.page>=params.low && params.page<=params.high){
    loadTable();
    return;
  }

  var newLow=Math.max(params.page-5,0);

  $.ajax({
      url: "https://api.github.com/repos/walmartlabs/thorax/issues",
      type: 'GET',

      data:{
        page:newLow,
        per_page:100
      },
      //load table asynchornously using data
      success: function(res) {
          params.data=res;
          params.low=newLow;
          params.high=newLow+Math.ceil(res.length/params.rowsPerPage);
          loadTable();
      },

      //alert user to errors form request
      failure: function(error){
        alert("invalid search parameters");
      }
  });
}

function getQueries(data,page,rowsPerPage){
  var start=(params.page-params.low)*params.rowsPerPage;
  var end=Math.min(start+params.rowsPerPage,params.data.length);

  //return 10 queries for correct page
  return params.data.slice(start,end);
}

function handleButtons(){
  buttonWrapper=$('#buttonWrapper');

  //clear current buttons
  buttonWrapper.html("");

  //display buttons for at most 5 previous pages
  var left=Math.max(0,params.page-5);

  //calculate largest possible page given number ofissues and issues per page
  var right=params.high;

  //check if first page button will be outputted already
  if(left!=0){
    buttonWrapper.append(`<button value=${0} class="pageBtn btn btn-sm btn-info">&#171; First</button>`);
  }

  for(var i=left;i<=right;i++){
    buttonWrapper.append(`<button value=${i} class="pageBtn btn btn-sm btn-info">${i+1}</button>`);
  }

  //check if last page is already outputted
  if (right != params.max) {
      buttonWrapper.append(`<button value=${Math.ceil(params.data.length/params.rowsPerPage)} class="pageBtn btn btn-sm btn-info">Last &#187;</button>`);
  }

  //change page number and load new data
  $('.pageBtn').on('click', function() {
        params.page = Number($(this).val());
        loadData();
  });
}



function loadTable() {
    var table = $('#tableBody');

    //load new issues
    var newQueries = getQueries();

    console.log(newQueries);

    //clear previous issues
    table.html("");


    for (let i=0;i<newQueries.length;i++) {
        //output data members of each issue object

        var row = `<tr>
                  <td>${newQueries[i].number}</td>
                  <td>${newQueries[i].user.login}</td>
                  <td>${newQueries[i].title}</td>
                  <td>${newQueries[i].state}</td>
                  </tr>
                  `
        table.append(row);
    }

    //change page buttons accordingly
    handleButtons();

    $(document).ready(function () {
      $('#issueTable').DataTable();
      $('.dataTables_length').addClass('bs-select');
    });
}

//initialize data
loadData();
