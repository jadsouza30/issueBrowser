//captures state of issues being displayed
var params={
  data: {},
  displayedData:{},
  page: 0,
  rowsPerPage: 10,
  filter:"",
  order:"",
  low:0,
  high:-1,
  max:5,
  owner:'walmartlabs',
  repo:'thorax',
  sort:'created',
  state:'all'
};

function loadData(filtered){
  //data already in cahce
  if(!filtered){
    if(params.page>=params.low && params.page<=params.high){
      loadTable();
      return;
    }
  }

  //cache previous 5 pages as well
  var newLow=Math.max(params.page-5,0);

  //load new data
  $.ajax({
      url: `https://api.github.com/repos/${params.owner}/${params.repo}/issues`,
      type: 'GET',

      data:{
        page:newLow,
        sort:params.sort,
        state:params.state,
        //load at most 100 results, 10 pages total
        per_page:10*params.rowsPerPage
      },

      //load table asynchornously using data
      success: function(res) {
          console.log(res);
          params.data=res;
          params.low=newLow;
          params.high=newLow+Math.ceil(res.length/params.rowsPerPage)-1;
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
  params.displayedData=params.data.slice(start,end);
  return params.data.slice(start,end);
}

function handleButtons(){
  buttonWrapper=$('#buttonWrapper');

  //clear current buttons
  buttonWrapper.html("");

  //display buttons for at most 5 previous pages
  var left=Math.max(0,params.page-5);

  //calculate largest possible page given number ofissues and issues per page
  var right=Math.min(params.page+5,params.max);

  //check if first page button will be outputted already
  if(left!=0){
    buttonWrapper.append(`<button value=${0} class="pageBtn btn btn-sm btn-info">&#171; First</button>`);
  }

  if(params.page!=0){
    buttonWrapper.append(`<button value=${params.page-1} class="pageBtn btn btn-sm btn-info">Prev</button>`);
  }

  for(var i=left;i<=right;i++){
    buttonWrapper.append(`<button value=${i} class="pageBtn btn btn-sm btn-info">${i+1}</button>`);
  }

  buttonWrapper.append(`<button value=${params.page+1} class="pageBtn btn btn-sm btn-info">Next</button>`);

  //check if last page is already outputted
  if (right != 10) {
      buttonWrapper.append(`<button value=${Math.ceil(params.data.length/params.rowsPerPage)} class="pageBtn btn btn-sm btn-info">Last &#187;</button>`);
  }

  //change page number and load new data
  $('.pageBtn').on('click', function() {
        params.page = Number($(this).val());
        loadData(false);
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
                  <td>
                    <button class="issueSelector btn btn-rounded btn-success"><i class="fas fa-plus pl-1"></i></button>
                  </td>
                  <td>${newQueries[i].number}&nbsp</td>
                  <td>${newQueries[i].user.login}</td>
                  <td>${newQueries[i].title}</td>
                  <td>${newQueries[i].state}</td>
                  </tr>
                  `
        table.append(row);
    }

    $('.issueSelector').on('click', function() {
          $('#myModal').modal('show');
          var issue=displayedData[$(this).val()];
          $('#issueNum').html();
    });

    $('#filter').on('click', function() {
          params.sort=$('#sort').val();
          params.state=$('#state').val();
          params.page=1;
          loadData(true);
    });

    //change page buttons accordingly
    handleButtons();
}

//initialize data
loadData(false);
