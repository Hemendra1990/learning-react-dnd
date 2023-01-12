import React, { useEffect, useState } from 'react'

export default function HDInput({element}) {
  const [value, setValue] = useState("");
  useEffect(()=> {
    setValue(element.value || "");
  }, [])
  return (
    <div><input value={value} onChange={(e) => {
      setValue(e.target.value);
      element.value = e.target.value;
    }} type={"text"}/></div>
  )
}
