import React, { useState } from "react";
import Select from "react-select";

let otherIncomes: number[] = [0];
let loanAmount: number[] = [0];
let cardAmount: number[] = [0];

function App() {
  const [multipleBuying, setMultipleBuying] = useState<boolean>(false);
  const [multipleIncome, setMultipleIncome] = useState<boolean>(false);
  const [hasLoans, setHasLoans] = useState<boolean>(false);
  const [hasCards, setHasCards] = useState<boolean>(false);
  const [incomeList, setIncomeList] = useState([{ income: "" }]);
  const [loanList, setLoanList] = useState([{ loan: "" }]);
  const [cardList, setCardList] = useState([{ card: "" }]);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalLoans, setTotalLoans] = useState<number>(0);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [totalDeposit, setTotalDeposit] = useState<number>(0);
  const [borrowing, setBorrowing] = useState<number>(0);
  const [property, setProperty] = useState<number>(0);
  const [needsUpdate, setNeedsUpdate] = useState<string>('');

  interface resultObj {
    result: {
      borrowing: number;
      property: number;
    };
  }

  const addField = (type: String) => {
    if (type === "Income") {
      setIncomeList([...incomeList, { income: "" }]);
    }
    if (type === "Loan") {
      setLoanList([...loanList, { loan: "" }]);
    }
    if (type === "Card") {
      setCardList([...cardList, { card: "" }]);
    }
  };

  const removeField = (type: String, index: number) => {
    if (type === "Income") {
      if (index === 0) {
        setMultipleIncome(false);
      } else {
        const list = [...incomeList];
        list.splice(index, 1);
        setIncomeList(list);
      }
    }
    if (type === "Loan") {
      if (index === 0) {
        setHasLoans(false);
      } else {
        const list = [...loanList];
        list.splice(index, 1);
        setLoanList(list);
      }
    }
    if (type === "Card") {
      if (index === 0) {
        setHasCards(false);
      } else {
        const list = [...cardList];
        list.splice(index, 1);
        setCardList(list);
      }
    }
  };

  const incomeOptions = [
    { value: 1, label: "per year" },
    { value: 12, label: "per month" },
    { value: 52, label: "per week" },
    { value: 1787, label: "per hour" },
  ];

  const [details, setDetails] = useState({
    firstIncome: 0,
    secondIncome: 0,
    deposit: 0,
  });

  const url = "https://test-api-self.vercel.app/calculate";
  const postEvent = (e: any) => {
    const finalLoanAmount = loanAmount.reduce((a, c) => {
      return a + c;
    }, 0);
    const finalCardAmount = cardAmount.reduce((a, c) => {
      return a + c;
    }, 0);
    var totalLiabilities = +finalLoanAmount + +finalCardAmount;
    var depositPlaceholder = totalDeposit;
    if (totalLiabilities === 0) {
      totalLiabilities += 0.000001;
    }
    if (depositPlaceholder === 0) {
      depositPlaceholder += 0.000001;
    }
    const postData = {
      total_income: totalIncome,
      total_liabilities: totalLiabilities,
      deposit: depositPlaceholder,
    };
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((json) => {
        let obj: resultObj = JSON.parse(JSON.stringify(json));
        setBorrowing(Math.round(obj.result.borrowing));
        setProperty(Math.round(obj.result.property));
      })
      .catch((e) => {
        console.log("e", e);
      });
      setNeedsUpdate('');
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setDetails((prev) => {
      return { ...prev, [name]: value };
    });
    const finalOtherIncomes = otherIncomes.reduce((a, c) => {
      return a + c;
    }, 0);
    const finalLoanAmount = loanAmount.reduce((a, c) => {
      return a + c;
    }, 0);
    const finalCardAmount = cardAmount.reduce((a, c) => {
      return a + c;
    }, 0);
    setTotalIncome(
      +details["firstIncome"] + +details["secondIncome"] + +finalOtherIncomes
    );
    setTotalLoans(+finalLoanAmount);
    setTotalCards(+finalCardAmount);
    setTotalDeposit(+details["deposit"]);
    setNeedsUpdate('needs-update');
  };

  return (
    <div className="App" onChange={handleChange}>
      <div className="calculator">
        <div className="content">
          <div className="title">Calculator</div>
          <div className="results">
            <div className="results-container">
              <span className="results-text">Here's what you can borrow</span>
              <span
                className="results-text"
                style={{ fontWeight: 600, marginBottom: 24 }}
              >
                ${borrowing.toLocaleString()}
              </span>
              {totalDeposit > 0 && (
                <span className="deposits-text">
                  With your deposit of ${totalDeposit.toLocaleString()} you could afford a
                  property up to ${(totalDeposit + borrowing).toLocaleString()}
                </span>
              )}
              <span className="results-text top">Total income</span>
              <span className="results-text">${totalIncome.toLocaleString()}</span>

              {totalLoans > 0 && (
                <>
                  <span className="results-text top">Total loans</span>
                  <span className="results-text">${totalLoans.toLocaleString()}</span>
                </>
              )}

              {totalCards > 0 && (
                <>
                  <span className="results-text top">Total credit cards</span>
                  <span className="results-text">${totalCards.toLocaleString()}</span>
                </>
              )}
            </div>
            <button
              className={`add-button results-button ${needsUpdate}`}
              style={{ left: "136px", top: "-2px", zIndex: "20" }}
              onClick={postEvent}
            >
              Update Results
            </button>
          </div>
          <form>
            <div className="inputs">
              <div className="input-title">
                How many of you are buying the property?
              </div>
              <ul>
                <li>
                  <input
                    type="radio"
                    value="1"
                    name="buying"
                    id="radio1"
                    onChange={() => {
                      setMultipleBuying(false);
                    }}
                    defaultChecked
                  />
                  <label htmlFor="radio1">Just Me</label>
                </li>
                <li>
                  <input
                    type="radio"
                    value="2"
                    name="buying"
                    id="radio2"
                    onChange={() => {
                      setMultipleBuying(true);
                    }}
                  />
                  <label htmlFor="radio2">I'm buying with someone</label>
                </li>
              </ul>

              <div className="input-title">
                What's your base salary/wages? (before tax)
              </div>
              <div className="deposit-input">
                <input type="number" name="firstIncome" placeholder="0" />
              </div>
              <Select
                className="select"
                defaultValue={incomeOptions[0]}
                name="firstSelect"
                options={incomeOptions}
              />

              {multipleBuying && (
                <>
                  <div className="input-title">
                    What's the second applicant's base salary/wages? (before
                    tax)
                  </div>
                  <div className="deposit-input">
                    <input type="number" name="secondIncome" placeholder="0" />
                  </div>
                  <Select
                    className="select"
                    defaultValue={incomeOptions[0]}
                    name="second-income"
                    options={incomeOptions}
                  />
                </>
              )}

              <div className="input-title">
                Do you have another source of income?
              </div>
              <ul>
                <li>
                  <input
                    type="radio"
                    value="3"
                    name="income"
                    id="radio3"
                    onChange={() => {
                      setMultipleIncome(true);
                    }}
                  />
                  <label htmlFor="radio3">Yes</label>
                </li>
                <li>
                  <input
                    type="radio"
                    value="4"
                    name="income"
                    id="radio4"
                    onChange={() => {
                      setMultipleIncome(false);
                    }}
                    defaultChecked
                  />
                  <label htmlFor="radio4">No</label>
                </li>
              </ul>

              {multipleIncome && (
                <>
                  {incomeList.map((singleIncome, index) => (
                    <div key={index}>
                      <div className="input-title">
                        Other income #{index + 1}
                      </div>
                      <div className="deposit-input">
                        <input
                          type="number"
                          name={`otherIncome${index}`}
                          placeholder="0"
                          onChange={(e) => {
                            otherIncomes.splice(index, 1);
                            otherIncomes.splice(
                              index,
                              0,
                              parseInt(e.target.value)
                            );
                          }}
                        />
                        <Select
                          className="select"
                          defaultValue={incomeOptions[0]}
                          name={`other-income-${index}`}
                          options={incomeOptions}
                        />
                        {incomeList.length - 1 === index && (
                          <>
                            <button
                              className="add-button"
                              onClick={() => addField("Income")}
                            >
                              Add Other Income
                            </button>
                            {incomeList.length > 1 && (
                              <button
                                className="add-button"
                                style={{ left: "230px" }}
                                onClick={() => removeField("Income", index)}
                              >
                                Remove Income
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="input-title">Do you have any loans?</div>
              <ul>
                <li>
                  <input
                    type="radio"
                    value="5"
                    name="loans"
                    id="radio5"
                    onChange={() => {
                      setHasLoans(true);
                    }}
                  />
                  <label htmlFor="radio5">Yes</label>
                </li>
                <li>
                  <input
                    type="radio"
                    value="6"
                    name="loans"
                    id="radio6"
                    onChange={() => {
                      setHasLoans(false);
                    }}
                    defaultChecked
                  />
                  <label htmlFor="radio6">No</label>
                </li>
              </ul>

              {hasLoans && (
                <>
                  {loanList.map((singeLoan, index) => (
                    <div key={index}>
                      <div className="input-title">Loan #{index + 1}</div>
                      <div className="deposit-input">
                        <input
                          type="number"
                          name="loans"
                          placeholder="0"
                          onChange={(e) => {
                            loanAmount.splice(index, 1);
                            loanAmount.splice(
                              index,
                              0,
                              parseInt(e.target.value)
                            );
                          }}
                        />
                        {loanList.length - 1 === index && (
                          <>
                            <button
                              className="add-button"
                              onClick={() => addField("Loan")}
                            >
                              Add Loan
                            </button>
                            {loanList.length > 1 && (
                              <button
                                className="add-button"
                                style={{ left: "292px" }}
                                onClick={() => removeField("Loan", index)}
                              >
                                Remove Income
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="input-title">Do you have any credit cards?</div>
              <ul>
                <li>
                  <input
                    type="radio"
                    value="7"
                    name="cards"
                    id="radio7"
                    onChange={() => {
                      setHasCards(true);
                    }}
                  />
                  <label htmlFor="radio7">Yes</label>
                </li>
                <li>
                  <input
                    type="radio"
                    value="8"
                    name="cards"
                    id="radio8"
                    onChange={() => {
                      setHasCards(false);
                    }}
                    defaultChecked
                  />
                  <label htmlFor="radio8">No</label>
                </li>
              </ul>

              {hasCards && (
                <>
                  {cardList.map((singleCard, index) => (
                    <div key={index}>
                      <div className="input-title">
                        Credit Card #{index + 1}
                      </div>
                      <div className="deposit-input">
                        <input
                          type="number"
                          name="cards"
                          placeholder="0"
                          onChange={(e) => {
                            cardAmount.splice(index, 1);
                            cardAmount.splice(
                              index,
                              0,
                              parseInt(e.target.value)
                            );
                          }}
                        />
                        {cardList.length - 1 === index && (
                          <>
                            <button
                              className="add-button"
                              onClick={() => addField("Card")}
                            >
                              Add Credit Card
                            </button>
                            {cardList.length > 1 && (
                              <button
                                className="add-button"
                                style={{ left: "246px" }}
                                onClick={() => removeField("Card", index)}
                              >
                                Remove Income
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <div className="input-title">How much deposit do you have?</div>
              <div className="deposit-input">
                <input type="number" name="deposit" placeholder="0" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
