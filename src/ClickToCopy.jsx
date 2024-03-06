import React, { useRef, useState } from "react";
import { useGlobalContext } from "./context";

const ClickToCopy = () => {
  const [copyGasSuccess, setCopyGasSuccess] = useState("copy");
  const [copySnifferSuccess, setCopySnifferSuccess] = useState("copy");
  const { saveItem } = useGlobalContext();
  const [item, setItem] = useState(JSON.parse(saveItem));

  const copyGas = useRef(null);
  const copySniffer = useRef(null);

  function copyGasToClipboard(e) {
    copyGas.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setItem(item);
    setCopyGasSuccess("Copied!");
  }

  function copySnifferToClipboard(e) {
    copySniffer.current.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    setItem(item);
    setCopySnifferSuccess("Copied!");
  }

  return (
    <div className="copyTab">
      <p style={{ fontSize: "10px", color: "darkred" }}>
        Registered Device(s) ConnectID
      </p>
      <form>
        <div className="form-group">
          <input
            className="form-field"
            type="text"
            value={item[0].dbName}
            ref={copyGas}
            required
          />
          {
            /* Logical shortcut for only displaying the
            button if the copy command exists */
            document.queryCommandSupported("copy") && (
              <span onClick={copyGasToClipboard}>{copyGasSuccess}</span>
            )
          }
        </div>
        {item.length > 1 && (
          <div className="form-group">
            <input
              className="form-field"
              type="text"
              value={item[1].dbName}
              ref={copySniffer}
              required
            />
            {
              /* Logical shortcut for only displaying the
            button if the copy command exists */
              document.queryCommandSupported("copy") && (
                <span onClick={copySnifferToClipboard}>
                  {copySnifferSuccess}
                </span>
              )
            }
          </div>
        )}
      </form>
    </div>
  );
};

export default ClickToCopy;

// import React, { useState } from "react";

// const eGas = [
//   {
//     category: "eScale",
//     name: "smartGas",
//     dbName: "eGas/smartGas1708332897156721",
//     status: false,
//   },
//   {
//     category: "Sniffer",
//     name: "akpos",
//     dbName: "eGas/akpos1708332911314889",
//     status: false,
//   },
// ];

// const ClickToCopy = () => {
//   const [loadItem, setLoadItem] = useState(eGas);

//   function copyToClipboard(item) {
//     navigator.clipboard.writeText(item);
//     const eGasUpdate = eGas.map((eGasItem) => {
//       if (eGasItem.category === item) {
//         console.log({ status: true });
//         return [{ ...eGasItem, status: true }];
//       } else {
//         console.log({ status: false });
//         return [{ ...eGasItem, status: false }];
//       }
//     });
//     setLoadItem(eGasUpdate);
//     console.log(loadItem[0]);
//   }

//   // useEffect(() => {
//   //   copyToClipboard();
//   // }, [loadItem]);

//   return (
//     <div className="copyTab">
//       <form>
//         {eGas.map((item, index) => (
//           <div className="form-group">
//             <input
//               className="form-field"
//               type="text"
//               value={item.name}
//               required
//               key={index}
//             />
//             {
//               /* Logical shortcut for only displaying the button if the copy command exists */
//               document.queryCommandSupported("copy") && (
//                 <span onClick={() => copyToClipboard(item.category)}>
//                   {item.status ? "Copy" : "Copied"}
//                 </span>
//               )
//             }
//           </div>
//         ))}
//       </form>
//     </div>
//   );
// };

// export default ClickToCopy;
