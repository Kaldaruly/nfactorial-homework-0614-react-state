import { set } from "date-fns";
import { useEffect, useState } from "react";
import { v4 as ID } from "uuid";
import "./App.css";

const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];


function App() {
  const newItem = () =>{
    let items = localStorage.getItem('items');

    if(items){
      return JSON.parse(items);
    }else return [];
  }
  const [itemToAdd, setItemToAdd] = useState("");
  const [itemToSearch, setItemToSearch] = useState("");
  const [items, setItems] = useState(newItem);
  const [filterType, setFilterType] = useState("");

  useEffect(() =>{
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    setItems((prevItems) => [
      { label: itemToAdd, key: ID() },
      ...prevItems,
    ]);

    setItemToAdd("");

    localStorage.setItem('items', JSON.stringify(itemToAdd));
    localStorage.getItem('items');
  };

  const handleItemDone = ({ key }) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        } else return item;
      })
    );
  };

  const handleDeleteItem = ({key}) =>{
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  const handleImportant = ({ key }) =>{
    setItems((p) => p.map((item) => {
      if(item.key === key) return {...item,change: !item.change}
      else return item;
    }))
  }

  const handleSearchItem = (event) =>{
      setItemToSearch(event.target.value);
  }

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleSearchItem}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="list-group todo-list">
        {filteredItems.length > 0 && filteredItems.filter(item => item.label.includes(itemToSearch)).map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className={`todo-list-item-label ${!item.change ? "" : "text-warning"}`}
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                  onClick={() => handleImportant(item)}
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleDeleteItem(item)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}

export default App;
