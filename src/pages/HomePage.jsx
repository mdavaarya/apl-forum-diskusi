import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ThreadComposer from '../components/ThreadComposer';
import CategoryFilter from '../components/CategoryFilter';
import ThreadList from '../components/ThreadList';
import { asyncPopulateThreads, setFilterCategory } from '../states/threads/threadsSlice';
import { asyncPopulateUsers } from '../states/users/usersSlice';

function HomePage() {
  const dispatch = useDispatch();
  const { items: threads, filterCategory } = useSelector((state) => state.threads);
  const users = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(asyncPopulateThreads());
    dispatch(asyncPopulateUsers());
  }, [dispatch]);

  const categories = useMemo(
    () => [...new Set(threads.map((thread) => thread.category).filter(Boolean))],
    [threads],
  );

  const filteredThreads = useMemo(
    () => (filterCategory === 'all'
      ? threads
      : threads.filter((thread) => thread.category === filterCategory)),
    [threads, filterCategory],
  );

  return (
    <div className="page">
      <h1 className="page-heading">Thread terbaru</h1>
      <p className="page-subheading">Ikuti dan mulai diskusi bersama komunitas.</p>

      <ThreadComposer />
      <CategoryFilter
        categories={categories}
        activeCategory={filterCategory}
        onChange={(category) => dispatch(setFilterCategory(category))}
      />
      <ThreadList threads={filteredThreads} users={users} />
    </div>
  );
}

export default HomePage;
