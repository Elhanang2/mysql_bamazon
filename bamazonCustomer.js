
//dependency
var mysql = require("mysql");
var inquirer = require("inquirer");

//mysql db connection info
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

//initiate mysql connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showitem();
  });

  //function to give even space between the colomns
  function colomnspace(x){
      var result ="";
      for(var i = 0; i < x ; i++){
          result += " ";

      }
      return result;
  }

  //function to show all rows of the product table 
  function showitem(){
      //mysql query to view all the table information 
      connection.query("select * from products ",function(err,res){
          if(err)throw err;
         console.log("Item Id"+colomnspace(6) + "Product Name" + colomnspace(23) + "Price" + colomnspace(11)+"stock quantity"+ colomnspace(4) + "product sales");
        for (var j = 0; j < res.length ; j++){
            //product name length 
            var y=(res[j].product_name).length;
            //item id length
            var z=(res[j].item_id).toString().length;
            //  console.log(z);
            var w=(res[j].stock_quantity).toString().length;
            var x=(res[j].price).toString().length;
               console.log(res[j].item_id + colomnspace(13-z) + res[j].product_name + colomnspace(35-y)+ "$"+res[j].price+
            colomnspace(15-x)+ res[j].stock_quantity + colomnspace(18-w)+res[j].product_sales);
        }
         productid(res);
         // connection.end();
      });
  }

  //function to ask customer what product they want to buy and process the output 
  function productid(res){
      inquirer.prompt({
          
              type : "input",
              name : "items",
              message : "what product would you like to buy ? input the id"
          

      }).then(function(answer){
          //loop through the table depending on user input and get the row       
          for(var k = 0; k < res.length; k++){
             
            if(answer.items == res[k].item_id){
               var itemid =res[k].item_id;
                
                 stockquantity=res[k].stock_quantity;
                 price=res[k].price;
                console.log("stock quantity : "+ res[k].stock_quantity);
                console.log("id : "+res[k].item_id);
                units(stockquantity,itemid,price);
                
              }
    
          }
          
      });
  }

  //function to to ask customers quantity of the product they want to buy
  //and update the table if the required amount of product available 
  function units(stock,itemid,price){
    //   var stock;
      inquirer.prompt({
        type : "input",
        name : "productunits",
        message : "how money units of product would you like to buy ?"
      }).then(function(answer){
            
          if(answer.productunits <= stock){
            
            console.log("units : "+ answer.productunits);
            var quantity=stock-answer.productunits;
            console.log("stock quantity : "+quantity);

            //mysql query to update stock quantity 
            connection.query("update products set ? where ?",[{stock_quantity : quantity},{item_id : itemid}],function(err){
                if(err)throw err;
                // var previous=answer.product_sales;
                var totalcost= answer.productunits*parseFloat(price,2);
                console.log("Total cost : "+totalcost);
                connection.query("select product_sales from products where ?",{item_id :itemid},function(err,res){
                    console.log("res  "+res[0].product_sales);
                  
                    var oldresofproductsale=parseFloat(res[0].product_sales,2);
                    console.log("old   "+oldresofproductsale);

                    connection.query("update products set ? where ? " , [{product_sales:(totalcost + oldresofproductsale) },{item_id :itemid}],function(err,res){
                        if(err)throw err;
                        console.log("process payment to get the product ");
                        connection.end();
                });
                });
                //mysql query to update product sales from the above calculation
                
            });
            
          }else if((answer.productunits) > stock && (stock > 0)){
              console.log("Insufficient quantity! \n "+ "we have "+stock +" items");
              units(stock);
          }else if(stock==0){
            console.log( "The item is not avalable");
            productid();
          }

      });
  }