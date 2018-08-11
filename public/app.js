// TODO
// const App = () => (
//     <div>eyoo world</div>
// );

// const Cucumbers = () => (
//     <li> Cucumbers </li>
// );
// const Kale = () => (
//     <li> Kale </li>
// );

// const GroceryListItem = (props) => (
//     <li key={props.id}> {props.name} 
//     </li>
// )

class GroceryListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
  }
  onClick() {
    this.setState({
      done: !this.state.done
    });
  }
  render() {
    var isCompleteClass = this.state.done ? 'completed' : '';
    return <li key={this.props.id} className={isCompleteClass} onClick={this.onClick.bind(this)}> {this.props.name} </li>
  }
}

class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.grocList = props.list;
  }
  
  notADuplicate(currentItem, toAppend) {
    return (this.grocList.state.items.indexOf(currentItem) === -1 && toAppend.indexOf(currentItem) === -1)
  }

  onClick() {
    let newItem = prompt('What item do we need, fam? (Multiple items by comma delimited)') || false;
    const newIndex = document.querySelectorAll('#groceryList li').length;
    if (newItem && newItem.trim() !== "") {
      const allItems = newItem.trim().split(",");
      const toAppend = [];
      for (let i = 0; i < allItems.length; i++) {
        const currentItem = allItems[i];
       if (currentItem.trim() !=='' && this.notADuplicate(currentItem.trim(), toAppend)) {
        toAppend.push(currentItem.trim());
       }
      }
      this.grocList.setState({ items: this.grocList.state.items.concat(toAppend) });
    }
  }
  render() {
    return (<div><button onClick={this.onClick.bind(this)}> Add item </button></div>);
  }
}
class GroceryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.items
    }
  }
  render() {
    return (
      <div>
        <ul>
          {this.state.items.map((item, index) => {
            return <GroceryListItem name={item} key={index} />
          })}
        </ul>
      </div>
    )
  }
}

var grocList = ReactDOM.render(<GroceryList id='groceryList' items={['apples', 'oranges', 'cold brew', 'olive oil']} />, document.getElementById("app_wpr"));
ReactDOM.render(<AddItem list={grocList} />, document.getElementById("input_wpr"));