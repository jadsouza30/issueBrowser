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

$.ajax({
    url: "https://api.github.com/repos/walmartlabs/thorax/issues",
    type: 'GET',

    //load table asynchornously using data
    success: function(res) {
        params.data=res;
        params.high=res.length-1;
        loadTable();
    },

    //alert user to errors form request
    failure: function(error){
      alert("invalid search parameters");
    }
});

function getQueries(data,page,rowsPerPage){
  var start=(params.page-1)*params.rowsPerPage;
  var end=Math.min(start+params.rowsPerPage,params.high);
  console.log(params.data.length);
  if(start>=params.low && end<=params.high){
    return params.data.slice(start-params.low,end-params.low);
  }
}

function handleButtons(){
  buttonWrapper=$('#buttonWrapper');

  //clear current buttons
  buttonWrapper.html("");

  //display buttons for at most 3 previous pages
  var left=Math.max(1,params.page-3);

  //calculate largest possible page given number ofissues and issues per page
  var right=Math.min(Math.ceil(params.data.length/params.rowsPerPage),params.page+5);

  //check if first page button will be outputted already
  if(left!=1){
    buttonWrapper.append(`<button value=${1} class="pageBtn btn btn-sm btn-info">&#171; First</button>`);
  }

  for(var i=left;i<=right;i++){
    buttonWrapper.append(`<button value=${i} class="pageBtn btn btn-sm btn-info">${i}</button>`);
  }

  //check if last page is already outputted
  if (right != Math.ceil(params.data.length/params.rowsPerPage)) {
      buttonWrapper.append(`<button value=${Math.ceil(params.data.length/params.rowsPerPage)} class="pageBtn btn btn-sm btn-info">Last &#187;</button>`);
  }

  //change page number and load new data
  $('.pageBtn').on('click', function() {
        params.page = Number($(this).val());
        loadTable();
  });
}



function loadTable() {
    var table = $('#tableBody');

    //load new issues
    var newQueries = getQueries();

    //clear previous issues
    table.html("");

    for (let i=0;i<newQueries.length;i++) {
        //output data members of each issue object
        var row = `<tr>
                  <td>${newQueries[i].number}</td>
                  <td>${newQueries[i].user.login}</td>
                  <td>${newQueries[i].state}</td>
                  `
        table.append(row);
    }

    //change page buttons accordingly
    handleButtons();
}
