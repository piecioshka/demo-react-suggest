import { ChangeEvent, useCallback, useRef, useState } from 'react';
import './Suggest.css';
import { useDebounce } from '../../hooks/useDebounce';
import { findUsers } from '../../services/users';
import { User } from '../../types/user';

export const Suggest: React.FC<unknown> = () => {
  const isDebounceEnabled = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);

  const controller = useRef(new AbortController());
  const request = useRef<Promise<User[]> | null>();

  const onChangeRegular = useCallback(async (phrase: string) => {
    if (!phrase) {
      return;
    }

    if (request.current) {
      controller.current.abort();
      controller.current = new AbortController();
    }

    try {
      request.current = findUsers(phrase, {
        signal: controller.current.signal,
      });
      setUsers(await request.current);
    } catch (err) {
      // empty
      console.error(err);
    }

    request.current = null;
  }, []);

  const onChangeDebounced = useDebounce(onChangeRegular, 500);

  const onChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      const phrase = evt.target.value.trim();
      setUsers([]);
      isDebounceEnabled.current?.checked
        ? onChangeDebounced(phrase)
        : onChangeRegular(phrase);
    },
    [onChangeDebounced, onChangeRegular],
  );

  return (
    <div className="suggest">
      <label>
        <input
          type="checkbox"
          ref={isDebounceEnabled}
          data-testid="suggest-enable-debounce"
        />
        Use <code>debounce()</code>
      </label>

      <label className="suggest-label">
        🔎
        <input
          className="suggest-input"
          type="text"
          onChange={onChange}
          placeholder="Example 'Brandon Crona'"
          data-testid="suggest-input"
        />
      </label>

      <ul className="suggest-list" data-testid="suggest-list">
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
