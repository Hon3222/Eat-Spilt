import { Children, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handelShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handelAddNewFriend(firend) {
    setFriends((firends) => [...friends, firend]);
    setShowAddFriend(false);
  }
  function handelSpilltBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id ? { ...friend, balance: value } : friend
      )
    );
    setSelectedFriend(null);
  }

  function handeSelection(friend) {
    //setSelectedFriend(friend);
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friend={friends}
          onSelection={handeSelection}
          selectedFriend={selectedFriend}
        />
        {showAddFriend && <FormAddFriend onClick={handelAddNewFriend} />}
        <Button onClick={handelShowAddFriend}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSpilltBill
          selectedFriend={selectedFriend}
          handelSpilltBill={handelSpilltBill}
        />
      )}
    </div>
  );
}

function FriendList({ friend, onSelection, selectedFriend }) {
  return (
    <ul>
      {friend.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owe you {Math.abs(friend.balance)}$
        </p>
      ) : (
        <p>You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? " Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onClick }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handelAdding(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFrind = {
      id,
      name,
      image: `${image}=${id}`,
      balance: 0,
    };

    onClick(newFrind);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <form className="form-add-friend" onSubmit={handelAdding}>
      <label>🧑🏻‍🤝‍🧑🏼Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>🏞️Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSpilltBill({ selectedFriend, handelSpilltBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setpaidByUser] = useState("");
  const [whoPay, setWhoPay] = useState("user");
  const paidByFriend = bill ? bill - paidByUser : "";

  function handelSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;
    handelSpilltBill(whoPay === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-add-friend" onSubmit={handelSubmit}>
      <h2>Spilt bill with {selectedFriend.name} </h2>
      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
      />

      <label>💁You expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setpaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      />

      <label>🧑🏻‍🤝‍🧑🏼{selectedFriend.name}'s expense</label>
      <input type="text" value={paidByFriend} disabled />

      <label>🤔Who is paying the bill</label>
      <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Spilt bill</Button>
    </form>
  );
}
