/**
 * SKENARIO PENGUJIAN KOMPONEN: CategoryFilter
 *
 * <CategoryFilter /> component
 *  - harus merender tombol kategori "Semua" dan seluruh daftar chip kategori yang disediakan
 *  - harus menerapkan kelas 'active' pada chip kategori yang sedang aktif
 *  - harus memanggil onChange dengan nama kategori yang sesuai ketika tombol diklik
 *  - tidak merender apapun (null) ketika daftar kategori kosong
 */

import {
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from './CategoryFilter';

describe('CategoryFilter component', () => {
  const dummyCategories = ['react', 'redux', 'javascript'];

  it('harus merender tombol kategori "Semua" dan seluruh daftar chip kategori yang disediakan', () => {
    render(
      <CategoryFilter
        categories={dummyCategories}
        activeCategory="all"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'react' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'redux' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'javascript' })).toBeInTheDocument();
  });

  it('harus menerapkan kelas active pada chip kategori yang sedang aktif', () => {
    render(
      <CategoryFilter
        categories={dummyCategories}
        activeCategory="redux"
        onChange={vi.fn()}
      />,
    );

    const reduxChip = screen.getByRole('button', { name: 'redux' });
    const reactChip = screen.getByRole('button', { name: 'react' });

    expect(reduxChip).toHaveClass('active');
    expect(reactChip).not.toHaveClass('active');
  });

  it('harus memanggil onChange dengan nama kategori yang sesuai ketika tombol diklik', async () => {
    const handleChange = vi.fn();

    render(
      <CategoryFilter
        categories={dummyCategories}
        activeCategory="all"
        onChange={handleChange}
      />,
    );

    const reactChip = screen.getByRole('button', { name: 'react' });
    await userEvent.click(reactChip);

    expect(handleChange).toHaveBeenCalledWith('react');
  });

  it('tidak merender apapun ketika daftar kategori kosong', () => {
    const { container } = render(
      <CategoryFilter
        categories={[]}
        activeCategory="all"
        onChange={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
