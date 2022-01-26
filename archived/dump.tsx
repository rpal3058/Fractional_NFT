

</div>     

{/* Displaying NFT*/}
<div className="flex grid-cols-3 ">
{         
nftList.map((nftList) => {
return(   
  <div className="bg-white p-2 m-2 rounded mt-1 border-b border-grey cursor-pointer hover:bg-grey-lighter">
    <div className="text-sm mt-2 px-2">
      <div>
        <p>{"TOKENID :  " + nftList.tokenID}</p>
        <p>{"URI :  " + nftList.tokenURI}</p>
        <p>{"CREATOR :  " + nftList.creator.slice(0, 5)+ "..." +nftList.creator.slice(nftList.creator.length - 5)}</p>
        <p>{"CURRENT OWNER :  " + nftList.currentOwner.slice(0, 5)+ "..." +nftList.currentOwner.slice(nftList.currentOwner.length - 5)}</p>
        <p>{"OPERATOR :  " + nftList.operator.slice(0, 5)+ "..." +nftList.operator.slice(nftList.operator.length - 5)}</p>
        <p>{"SALES PRICE:  " + nftList.salesPrice}</p>
        <p>{"SOLD:  " + nftList.sold}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-1 px-1 rounded "
          onClick={() => {
            router.push("/" + nftList.tokenID);
          }}
        >
          SELECT NFT
        </button>
      </div>
    </div>
  </div>
  )
})
}
</div> 
