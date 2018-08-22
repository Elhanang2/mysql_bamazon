//dependencies
var mysql = require("mysql");
var inquirer =require("inquirer");

//mysql db conncetion information
var connection = mysql.createConnection({
    host : "localhost",
    port : 3307,
    user : "root",
    password : "Elhanang2",
    database : "bamazon"
});

//initiate mysql connection.
connection.connect(function(err){
    if(err)throw err;
    console.log("connected as id "+ connection.threadId + "\n");
    supervisormenu();
});

//function to give space b/n the colomns
function colomnspace(x){
    var result ="";
    for(var i = 0; i < x ; i++){
        result += " ";

    }
    return result;
}

//function which gives choice to the superviser to select view product sell by department 
//or create new department and give the output depending on the required input
function supervisormenu(){
    //prompt to get information from the user
    inquirer.prompt(
        {
            type : "list",
            name : "supervisorlist",
            message : "choise from the list to see the output \n",
            choices : ["View Product Sales by Department","Create New Department"]
    }).then(function(answer){
        // console.log("answer :"+answer.supervisorlist);
        //if the user choices view product sales by department mysql query selects department info
        //else create new department
        if(answer.supervisorlist == "View Product Sales by Department"){
            
            //mysql query to select department id , name ,over head costs ,product sales and total profit 
            connection.query(
            "select department_id ,d.department_name , over_head_costs , sum(p.product_sales) as product_sales,(sum(p.product_sales) - over_head_costs) as total_profit  from products as p  inner join departments as d on p.department_name = d.department_name  group by department_name order by department_id ASC;",function(err,res){
                // console.log("result "+ res);
                console.log("Department Id" + colomnspace(2) + "Department Name" +colomnspace(10) + "Over Head Costs" + colomnspace(6)+"Product Sales" + colomnspace(5) + "Total Profit" );
                
                //for loop to get the table info and change it to formal table 
                for (var j = 0; j < res.length ; j++){
                    //product name length 
                    var y=(res[j].department_id).toString().length;
                    var w = (res[j].department_name).length;
                    var z=(res[j].over_head_costs).toString().length;
                   
                    console.log(res[j].department_id + colomnspace(15-y) + res[j].department_name +colomnspace(25-w) + "$"+ res[j].over_head_costs + colomnspace(20-z)+res[j].product_sales + colomnspace(14)+res[j].total_profit );
                     
                }
                connection.end(); 
            });
        }else if(answer.supervisorlist == "Create New Department"){
            creatnewdept();
        }
    });
}

//function to cteate new department . 
//the user must give department name and over head cost 
function creatnewdept(){
    inquirer.prompt([
        {
        type : "input",
        name : "newdeptname",
        message : "Input the new department "
        },
        {
            type : "input",
            name : "overheadcost",
            message : "Input the over head cost"
        }
    ]).then(function(answer){
        var newdept=answer.newdeptname;
        if(answer.newdeptname && answer.overheadcost){
            //mysql query to insert values to the colomns
            connection.query("insert into departments set ? ",
                {
                    department_name : answer.newdeptname,
                    over_head_costs : answer.overheadcost,

                },
                function(err){
                    if(err)throw err;
                    console.log("The new record : ");
                    connection.query("select * from departments",function(err,res){
                        console.log(res);
                        
                        connection.end(); 
                    });
                }
            );
        }else{
            console.log("please give all required data ");
        }
    });
}