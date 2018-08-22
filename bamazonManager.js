//dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

//mysql db conncetion information
var connection=mysql.createConnection({
    host:"localhost",
    //my port 
    port : 3307,
    //user name
    user :"root",
    password : "Elhanang2",
    //database name
    database :"bamazon"
});

//initial mysql connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    menuoption();
   
  });

  //function to give an option  to users to select the action from view products for sales,
  //view low inventory , add to inventory, add new product 
  function menuoption(){
    inquirer.prompt({
        type: "list",
        name : "menu",
        message : "What do you want to see ?",
        choices : ["\n","View Products for Sale","View Low Inventory","Add to Inventory","Add New Product"]

    }).then(function(answer){
        // var update;
        //     var addnew;
        console.log(answer.menu);
        //if else option to compare user input and call the required  function
        if(answer.menu == "View Products for Sale" ){
            showitem();
        }else if(answer.menu == "View Low Inventory"){
            
            lowinventory();
        }else if(answer.menu == "Add to Inventory"){
            updateinventory();
            // updateonecolumn(itemidinput);
        }else if(answer.menu == "Add New Product"){
            addnewproduct();
        }
            
    });
  }
  
  //function to give the table colomns space for good looking
    function colomnspace(x){
        var result ="";
        for(var i = 0; i < x ; i++){
            result += " ";

        }
        return result;
    }

  //function to view product lists for sale 
function showitem(){

    //mysql query to view all the colomns from product table 
    connection.query("select * from products ",function(err,res){
    if(err)throw err;
    console.log("\n"+"Item Id"+colomnspace(6) + "Product Name" + colomnspace(23)+ "Price"  +colomnspace(11) + "Stock Quantity"+"\n");
    for (var j = 0; j < res.length ; j++){
        
        var y=(res[j].product_name).length;
        var z=(res[j].item_id).toString().length;
        var x=(res[j].price).toString().length;
            console.log(res[j].item_id + colomnspace(13-z) + res[j].product_name + colomnspace(35-y)+ "$"+res[j].price + colomnspace(15-x)+res[j].stock_quantity );
    }

    connection.end();
    });

}

//functions to view inventory with stock quantity less than 5
function lowinventory(){
    //mysql  query to select the colomns  to view product table
    connection.query("select  item_id , product_name, stock_quantity from products where stock_quantity < 5 ",
        function(err,res){
            if(err)throw err;
            console.log("\n"+ "Item Id"+colomnspace(6) + "Product Name" + colomnspace(23)   + "Stock Quantity"+"\n")
        for (var j = 0; j < res.length ; j++){
            //product name length 
            var y=(res[j].product_name).length;
            //item id length
            var z=(res[j].item_id).toString().length;
            //var x=(res[j].price).toString().length;
           console.log(res[j].item_id + colomnspace(13-z) + res[j].product_name + colomnspace(35-y)+res[j].stock_quantity );
        }
        //to end database connection
        connection.end();    
    });
      
     
}

//function to update the product table by asking the user which product they want to update 
// and display the product information they want to update 
function updateinventory(){
    inquirer.prompt(
        {
            type : "input",
            name : "itemid",
            message : "Input the item id to update the inventory"
        }
    ).then(function(answer){
        console.log(answer.itemid);
        var itemidinput;
        var ansitemid=answer.itemid;
        //
        connection.query("select * from products where ?",{item_id :answer.itemid },function(err,res){
            if(err)throw err;
            console.log("\n"+"Item Id"+colomnspace(6) + "Product Name" + colomnspace(15)+"Product Department"+colomnspace(7)+ "Price"  +colomnspace(11) + "Stock Quantity"+"\n");
            for (var j = 0; j < res.length ; j++){
                //product name length 
                var y=(res[j].product_name).length;
                var w = (res[j].department_name).length;
                var z=(res[j].item_id).toString().length;
                var x=(res[j].price).toString().length;
                console.log(res[j].item_id + colomnspace(13-z) + res[j].product_name +colomnspace(25-w) + res[j].department_name + colomnspace(35-y)+ "$"+res[j].price + colomnspace(15-x)+res[j].stock_quantity );
                 itemidinput=parseInt(res[j].item_id);
            }
           
            updateonecolumn(itemidinput);
            // return answer.itemid;
           
        });
        // connection.query("select  stock_quantity from products where ?",{item_id : answer.itemid},function(err,res){
        //    if(err)throw err;
        //    var remainingstock=parseInt(res[0].stock_quantity);
        //    console.log("stock quantity : "+ res[0].stock_quantity);
        //     // update(itemidinput,remainingstock,ansitemid);
        //     updateonecolumn(itemidinput);
        // });
        
    });
}

//function to update the required colomn in the table by selecting product colomn
function updateonecolumn(itemidinput){
    var ans;
    var userupdate;
    inquirer.prompt([
        {
            type : "list",
            name : "update",
            message : "what colomn in the products table you want to update ?",
            choices : ["product_name","department_name","price", "stock_quantity"]
        },
        {
            type : "input",
            name : "columnname",
            message : "Give  value of selected colomn "  
        }
 ]).then(function(answer){
        var ans=(answer.update).toString();
        
        
        var columninput=(answer.columnname).toString();
        
        //if else function to check which colomn selected to update  and use mysql query to update the table 
        if(answer.update == "product_name"){
            connection.query("update products set ?  where item_id = ?",[{department_name: columninput},itemidinput],function(err,result){
                if(err) throw err;
                console.log(answer.update + " updated to "+columninput);
                connection.end();
            });
        }else if(answer.update == "department_name"){
            connection.query("update products set ?  where item_id = ?",[ {department_name: columninput},itemidinput],function(err,result){
                if(err) throw err;
                console.log(answer.update + "  updated to "+ columninput );
                connection.end();

            }); 
        }else if(answer.update == "price"){
            connection.query("update products set ?  where item_id = ?",[ {price : columninput},itemidinput],function(err,result){
                if(err) throw err;
                console.log(answer.update+ "  updated to "+ columninput);
                connection.end();
            }); 
        }else if(answer.update == "stock_quantity"){
            connection.query("update products set ?  where item_id = ?",[ {stock_quantity : columninput},itemidinput],function(err,result){
                if(err) throw err;
                console.log(answer.update +" updated to "+ columninput);
                connection.end();
            });   
        }
            
    
    });
}


//function to add new products prompt ask questions to add each colomns 
//and mysql query insert the given colomns values
function addnewproduct(){
    inquirer.prompt([
        {
            type : "input",
            name : "productname",
            message : "Give name of the product "
        },
        {
            type : "input",
            name : "departmentname",
            message : "Give name of the department "
        },
        {
            type : "input",
            name : "unitprice",
            message : "Give name product unit price "
        },
        {
            type : "input",
            name : "stockquantity",
            message : "Give quantity of the product "
        }
    ]).then(function(answer){
            //mysql to insert product values
            connection.query("insert into products set ?",
            {
                product_name : answer.productname,
                department_name : answer.departmentname,
                price : answer.unitprice,
                stock_quantity :answer.stockquantity
            },function(err){
                if(err)throw err;
                console.log("row inserted");
                connection.end();  
            });
    
        
    });
}

