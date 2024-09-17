import { useEffect, useState } from 'react';

function Groups() {
  const pageParams = new URLSearchParams(window.location.search);

  const [page, setPage] = useState(pageParams.get('page') ? Number(pageParams.get('page')) : 1);
  const [totalPages, setTotalPages] = useState(0);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (pageParams.get('page') === null) {
      pageParams.set('page', '1');
      window.history.replaceState({}, '', `${window.location.pathname}?${pageParams}`);
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const fetchGroups = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/groups?per_page=10&page=${page}`, {
          credentials: 'include',
        });

        timer = setTimeout(() => {
          setLoading(true);
        }, 250);

        const res = await response.json();
        const meta = res.meta;

        setGroups(res.data);
        setPage(meta.current_page);
        setTotalPages(meta.total_pages);
      } catch (error) {
        console.error('Error fetching groups:', error);
      } finally {
        clearTimeout(timer);
        setLoading(false);
      }
    };

    fetchGroups();
  }, [page]);

  return (
    <div className='flex flex-col flex-grow py-8'>
      <h1 className='text-4xl font-bold text-white'>Groups</h1>

      {loading ? (
        <div className='flex flex-col items-center text-white'>
          <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
            <g>
              <circle cx='12' cy='2.5' r='1.5' fill='currentColor' opacity='.14' />
              <circle cx='16.75' cy='3.77' r='1.5' fill='currentColor' opacity='.29' />
              <circle cx='20.23' cy='7.25' r='1.5' fill='currentColor' opacity='.43' />
              <circle cx='21.5' cy='12' r='1.5' fill='currentColor' opacity='.57' />
              <circle cx='20.23' cy='16.75' r='1.5' fill='currentColor' opacity='.71' />
              <circle cx='16.75' cy='20.23' r='1.5' fill='currentColor' opacity='.86' />
              <circle cx='12' cy='21.5' r='1.5' fill='currentColor' />
              <animateTransform
                attributeName='transform'
                calcMode='discrete'
                dur='0.75s'
                repeatCount='indefinite'
                type='rotate'
                values='0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12'
              />
            </g>
          </svg>
          <p className='mt-4 text-xl text-gray-300'>Loading...</p>
        </div>
      ) : (
        <div className='flex flex-col justify-between flex-grow mt-8'>
          <ul className='flex-grow'>
            {groups.map(({ attributes }: any) => (
              <li key={attributes.id} className='py-2'>
                <h2 className='text-2xl font-semibold text-white'>{attributes.name}</h2>
                {attributes.description ? (
                  <p className='text-gray-300'>{attributes.description}</p>
                ) : (
                  <p className='text-gray-300'>No Description</p>
                )}
              </li>
            ))}
          </ul>

          <div className='mt-8'>
            {totalPages > 1 && (
              <div className='flex justify-between'>
                <button
                  onClick={() => {
                    if (page > 1) {
                      setPage(page - 1);
                      pageParams.set('page', String(page - 1));
                      window.history.pushState({}, '', `${window.location.pathname}?${pageParams}`);
                    }
                  }}
                  className={`px-4 py-2 text-white bg-blue-500 rounded ${
                    page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Previous
                </button>

                <span className='text-white'>
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => {
                    if (page < totalPages) {
                      setPage(page + 1);
                      pageParams.set('page', String(page + 1));
                      window.history.pushState({}, '', `${window.location.pathname}?${pageParams}`);
                    }
                  }}
                  className={`px-4 py-2 text-white bg-blue-500 rounded ${
                    page === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { Groups };
