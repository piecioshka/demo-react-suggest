import { ChangeEvent, useRef, useState } from 'react';
import './Suggest.css';
import { debounce } from '../../utils/debounce';
import { findUsers } from '../../services/users';
import { User } from '../../types/user';

export const Suggest: React.FC<unknown> = () => {
  const useDebounce = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  let controller = new AbortController();
  let request: Promise<User[]> | null = null;

  const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const phrase = e.target.value.trim();

    if (!phrase) {
      setUsers([]);
      return;
    }

    if (request) {
      controller.abort();
      controller = new AbortController();
    }

    try {
      request = findUsers(phrase, { signal: controller.signal });
      setUsers(await request);
      console.debug('piecioshka', { phrase, users });
    } catch {
      // empty
    }

    request = null;
  };

  const onChangeDebounced = debounce(onChange, 500);

  return (
    <div className="suggest">
      <label>
        <input type="checkbox" ref={useDebounce} />
        Use <code>debounce()</code>
      </label>

      <label className="suggest-label">
        🔎
        <input
          className="suggest-input"
          type="text"
          onChange={useDebounce.current?.checked ? onChangeDebounced : onChange}
          placeholder='Example "Brandon Crona"'
        />
      </label>

      <ul className="suggest-list">
        {users.map((user) => (
          <li key={user.id} className="suggest-item">
            <img src={user.avatarUrl} className="user-avatar" alt="" />
            <span className="user-name">{user.name}</span>
            <em className="user-email">{user.email}</em>
          </li>
        ))}
      </ul>
    </div>
  );
};
