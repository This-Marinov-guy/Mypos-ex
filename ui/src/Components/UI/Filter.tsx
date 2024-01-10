import React, { useState, FormEvent, ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import FilterForm from "../../interface/FilterFormInterface";


const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filterForm, setFilterForm] = useState<FilterForm>({
    dateFrom: searchParams.get("dateFrom") || "",
    dateTo: searchParams.get("dateTo") || "",
    name: searchParams.get("name") || "",
    egn: searchParams.get("egn") || "",
    details: searchParams.get("details") || "",
    room: searchParams.get("room") || "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FilterForm
  ) => {
    setFilterForm({ ...filterForm, [field]: e.target.value });
  };

  const filter = (event: FormEvent) => {
    event.preventDefault();

    const filteredForm = Object.fromEntries(
      Object.entries(filterForm).filter(([_, value]) => value !== "")
    );
    if (searchParams.get("page")) {
      setSearchParams({ page: `1`, ...filteredForm });
    } else {
      setSearchParams(filteredForm);
    }
  };

  const clear = () => {
    setFilterForm({
      dateFrom: "",
      dateTo: "",
      name: "",
      egn: "",
      details: "",
      room: "",
    });
    if (searchParams.get("page")) {
      setSearchParams({ page: `${searchParams.get("page")}` });
    } else {
      setSearchParams();
    }
  };

  return (
    <form onSubmit={filter} className="mx-4">
      <div className="mb-8 mt-4 flex flex-wrap gap-2">
        <div className="flex flex-nowrap items-center">
          <input
              value={filterForm.dateFrom}
              onChange={(e) => handleInputChange(e, "dateFrom")}
              type="date"
              placeholder="Date from"
              className="input-filter-l w-28"
          />
          <input
              value={filterForm.dateTo}
              onChange={(e) => handleInputChange(e, "dateTo")}
              type="date"
              placeholder="Date to"
              className="input-filter-r w-28"
          />
        </div>

        <div className="flex flex-nowrap items-center">
          <input
              value={filterForm.name}
              onChange={(e) => handleInputChange(e, "name")}
              type="text"
              placeholder="Name"
              className="input-filter-l w-28"
          />
          <input
              value={filterForm.egn}
              onChange={(e) => handleInputChange(e, "egn")}
              type="text"
              placeholder="EGN"
              className="input-filter-r w-28"
          />
        </div>
        <div className="flex flex-nowrap items-center">
          <div className="flex flex-nowrap items-center">
            <input
                value={filterForm.details}
                onChange={(e) => handleInputChange(e, "details")}
                type="text"
                placeholder="Details"
                className="input-filter-l w-28"
            />
          </div>
        </div>
        <div className="flex flex-nowrap items-center">
          <div className="flex flex-nowrap items-center">
            <input
                value={filterForm.room}
                onChange={(e) => handleInputChange(e, "room")}
                type="text"
                placeholder="Room"
                className="input-filter-r w-28"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Filter
        </button>
        <button type="button" className="text-red-400" onClick={clear}>
          Clear
        </button>
      </div>
    </form>
  );
};

export default Filter;
