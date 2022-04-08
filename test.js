const personArray = [
    { name: "John Doe", age: 20 },
    { name: "Jane Doe", age: 19 },
    { name: "Fred Doe", age: 32 },
    { name: "Chris Doe", age: 45 },
    { name: "Layla Doe", age: 37 },
  ];
  console.log(personArray)
  // personArray의 나이 평균을 구해주는 Arrow Function을 작성해봅시다.
  const getAgeAverage = (personArray) => {
      let sum = 0
      for (let person of personArray) {
          sum = sum + person.age
        }
        const average = sum / personArray.length

        return average
  };
  
  console.log(getAgeAverage(personArray));