import React, { useState } from "react";

const SearchComponent = ({ auth }: any) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredEmails, setFilteredEmails] = useState<any[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query.toLowerCase());

    const filtered = auth.emails?.filter((email: any) => {
      const from = email.from ? email.from.toLowerCase() : "";
      const subject = email.subject ? email.subject.toLowerCase() : "";
      const body = email.body ? email.body.toLowerCase() : "";

      return (
        from.includes(query) || subject.includes(query) || body.includes(query)
      );
    });

    setFilteredEmails(filtered);
    setSelectedEmail(null); // Reset selected email when search query changes
  };

  const handleEmailClick = (email: any) => {
    setSelectedEmail(email);
  };

  return (
    <div className="search-component">
      <input
        type="text"
        placeholder="Search emails..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="emails mt-10">
        {filteredEmails && filteredEmails.length > 0 ? (
          filteredEmails.map((email: any, index: number) => (
            <div
              key={index}
              className="card p-10 mb-10"
              style={{ textAlign: "left", cursor: "pointer" }}
              onClick={() => handleEmailClick(email)}
            >
              <h3>From: {email.from}</h3>
              <p>Subject: {email.subject}</p>
              <p>Date: {new Date(email.date).toDateString()}</p>
            </div>
          ))
        ) : (
          <p>No emails to display</p>
        )}
      </div>
      {selectedEmail && (
        <div className="email-details p-10 mt-10">
          <pre>
            From &nbsp;&nbsp;&nbsp;: {selectedEmail.from}
            <br />
            Subject : {selectedEmail.subject}
            <br />
            Date &nbsp;&nbsp;&nbsp;:{" "}
            {new Date(selectedEmail.date).toDateString()}
          </pre>
          <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }}></div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
