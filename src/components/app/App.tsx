import { Suggest } from '../suggest/Suggest';
import './App.css';

export const App: React.FC<unknown> = () => {
  return (
    <div id="app">
      <h1>
        Demo app with Suggest AutoComplete in{' '}
        <a href="https://react.dev/" target="blank" rel="outerlink">
          React
        </a>
      </h1>
      <Suggest />
    </div>
  );
};
