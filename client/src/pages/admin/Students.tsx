import { useEffect, useState, useMemo } from 'react';
import { Search, X, Download, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../lib/axios';
import { Student } from '../../lib/types';
import AdminSidebar from '../../components/AdminSidebar';

const DEPARTMENTS = [
  'All Departments', 'Computer Science', 'Biology', 'Physics',
  'History', 'Environmental Science', 'Chemistry', 'Mathematics',
  'Engineering', 'Economics',
];

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    api
      .get('/students')
      .then((r) => setStudents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollment_no.toLowerCase().includes(search.toLowerCase());
      const matchDept = deptFilter === 'All Departments' || s.department === deptFilter;
      const matchYear = !yearFilter || s.year === parseInt(yearFilter);
      return matchSearch && matchDept && matchYear;
    });
  }, [students, search, deptFilter, yearFilter]);

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Enrollment No.', 'Department', 'Year', 'College', 'Registered'];
    const rows = filtered.map((s) => [
      s.name, s.email, s.phone, s.enrollment_no, s.department,
      s.year, s.college?.name ?? '', format(new Date(s.created_at), 'yyyy-MM-dd'),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="font-heading font-bold text-primary text-2xl">Student Records</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading ? 'Loading...' : `${filtered.length} of ${students.length} students`}
            </p>
          </div>
          <button
            onClick={exportCSV}
            id="export-csv-btn"
            className="btn-outline py-2.5 px-5"
            disabled={filtered.length === 0}
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="px-6 lg:px-8 py-8 space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="students-search-input"
                type="text"
                placeholder="Search by name, email, or enrollment..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input pl-10"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <X size={15} />
                </button>
              )}
            </div>

            <select
              id="dept-filter"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="form-input w-auto"
            >
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>

            <select
              id="year-filter"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="form-input w-auto"
            >
              <option value="">All Years</option>
              {[1, 2, 3, 4, 5, 6].map((y) => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin text-primary opacity-40" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">No students found.</div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Enrollment No.</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>Phone</th>
                      <th>Trips</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((student) => (
                      <tr key={student.id}>
                        <td className="text-gray-400 text-xs">{student.id}</td>
                        <td>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-primary text-xs font-bold">{student.name[0]}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-primary text-sm">{student.name}</p>
                              <p className="text-gray-400 text-xs">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="font-mono text-xs">{student.enrollment_no}</td>
                        <td>{student.department}</td>
                        <td>
                          <span className="badge bg-primary/10 text-primary">{student.year}</span>
                        </td>
                        <td className="text-xs">{student.phone}</td>
                        <td>
                          <span className="font-semibold text-primary">{student._count?.registrations ?? 0}</span>
                        </td>
                        <td className="text-xs text-gray-400">
                          {format(new Date(student.created_at), 'MMM d, yyyy')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
