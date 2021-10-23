import LiveData from './livedata/LiveData';
import MutableLiveData from './livedata/MutableLiveData';

class NotesViewModel {
  private addressInput = new MutableLiveData<string>();
  postalCode = ` LiveData<String> = Transformations.switchMap(addressInput) {
            address -> repository.getPostCode(address) }`;

  get address(): LiveData<string> {
    return this.addressInput;
  }

  setInput(address: string) {
    this.addressInput.value = address;
  }

  static getTag() {}
}

const main = () => {
  const viewModel = new NotesViewModel();
  viewModel.address.observe((data) => {
    console.log('Observe 1 : ' + data);
  });
  viewModel.address.observe((data) => {
    console.log('Observe 2 : ' + data);
  });
  let count = 1;
  setInterval(() => {
    viewModel.setInput('Count: ' + count++);
  }, 1000);
};

main();

// const App = () => {
//     return (

//     )
// }
