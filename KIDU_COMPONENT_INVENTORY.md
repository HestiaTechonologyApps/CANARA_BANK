# Kidu Component Inventory — Canara Bank

Legend: [Purpose] then (Ingredients: ...)

Scope: `CANARA_BANK/src/` components with `Kidu` in their filename, including shared components in `src/Components/` and admin-specific components in `src/ADMIN-PORTAL/Components/`. “Browser location” gives the route path relative to the running site origin. Admin/staff paths require a logged-in account with the matching role.

## How to view these components in the browser

Start the frontend with `npm run dev`, then open the route listed below on the Vite origin (commonly `http://localhost:5173`). The code defines the relative routes; the actual hostname/port depends on the local or deployed environment.

- Admin pages live under `/dashboard/...` and require `SystemAdmin` or `Administrator`.
- Staff pages live under `/staff-portal/...` and require `OfficeStaff` or `DEO`.
- Components rendered inside a modal, dropdown or page section are visible only after opening the associated control.
- “No current page” means the component source exists but no active import/usage was found in the source tree. It has no current browser location.

## Shared components — `src/Components/`

| Component | Purpose and what it uses | Where it is used in code | Browser location |
|---|---|---|---|
| `KiduAttachments.tsx` | Displays and manages attachments for a record. Used by generic admin view/edit forms; talks to attachment services and accepts record/table identifiers. | `ADMIN-PORTAL/Components/KiduView.tsx`, `KiduEdit.tsx` | Any routed admin detail or edit page using `KiduView`/`KiduEdit` (examples: `/dashboard/claims/deathclaims-view/:deathClaimId`, `/dashboard/contributions/member-edit/:memberId`). Open the attachment section on the page. |
| `KiduAuditLogs.tsx` | Shows audit history for a record. Uses audit service and record/table identifiers. | `ADMIN-PORTAL/Components/KiduView.tsx`, `KiduEdit.tsx` | Same detail/edit routes that use the generic forms; audit section is on the relevant record page. |
| `KiduButton.tsx` | Styled button supporting a label plus optional navigation target or click callback. Uses React Bootstrap `Button` and React Router navigation. | `KiduServerTable.tsx` | Any list page using the shared server table, e.g. `/dashboard/settings/state-list`. |
| `KiduCard.tsx` | Reusable card/panel with configurable display content. | `ADMIN-PORTAL/Pages/Dashboard/DashBoardCards.tsx` | `/dashboard` (admin dashboard home). |
| `KiduCreateAttachment.tsx` | Stages/selects attachments as part of record creation; exposes a ref handle to consuming forms. | Admin death-claim, refund, direct-entry, expense-master creation pages; staff refund and direct-entry creation pages. | `/dashboard/claims/deathclaims-create`, `/dashboard/claims/refundcontribution-create`, `/dashboard/contributions/accountDirectEntry-create`, `/dashboard/administration/expensemaster-create`, `/staff-portal/refund-list/MemberRefundContribution-create`, `/staff-portal/contributions/staffaccountDirectEntry-create`. |
| `KiduCreateModal.tsx` | Generic typed modal form with field definitions, validation, reset and submit behavior. Uses `KiduValidation` and `KiduReset`; caller supplies submit/create behavior. | Branch, circle, year, company, category, designation, month, state, status, report-type, member and expense-type modal components under `ADMIN-PORTAL/Pages/`. | Open the create modal from the corresponding admin list page where its popup trigger is rendered. Examples: `/dashboard/settings/branch-list`, `/dashboard/settings/yearMaster-list`, `/dashboard/settings/category-list`, `/dashboard/settings/company-list`, `/dashboard/settings/state-list`. |
| `KiduDownload.tsx` | CSV download link/button using `react-csv`; props include data, filename, class and style. | No current import/usage found. | No current page. |
| `KiduDropdown.tsx` | Dynamic list of “Drop Locations” text inputs, allowing add/remove up to four visible entries. Uses React Bootstrap form controls and plus/trash icons. | No current import/usage found. | No current page. |
| `KiduExcelButton.tsx` | Exports provided rows as a CSV file (despite the Excel button label); adds serial numbers, reverses row order and creates a dated default filename. | No current import/usage found. | No current page. |
| `KiduLoader.tsx` | Loading indicator component. | Admin dashboard/chart; generic edit/view forms; server tables; staff profile; contact-message detail. | `/dashboard`, list pages, record edit/detail pages, `/staff-portal` while data is loading. The loader is transient. |
| `KiduLogoutModal.tsx` | Confirms logout before calling the supplied confirm callback. | Admin and staff navbar/sidebar. | Visible after selecting the logout control on `/dashboard/...` or `/staff-portal/...`. |
| `KiduNotes.tsx` | Displays a blue note panel from a `message` prop. | No current import/usage found. | No current page. |
| `KiduPopup.tsx` | Searchable/paginated record picker modal; supports local endpoint loading or server-side pagination, optional add modal and selection callback. Uses `HttpService`, `KiduServerTable`, and modal z-index helper. | Lookup/pop-up wrappers for branch, circle, year, expense type, company, member, category, designation, month, report type, state and status; also member/list selection. | Open the relevant selector from its parent admin create/edit/list form. Parent pages are in `/dashboard/settings/...`, `/dashboard/contributions/...`, and `/dashboard/administration/...`; exact entity route examples are given in the route map below. |
| `KiduPopupButton.tsx` | Styled control that opens a popup/lookup. | Nested by popup/table components and directly by member selection/list UI. | On the parent form/list pages that show a lookup control; see `KiduPopup.tsx` routes. |
| `KiduPrevious.tsx` | Navigates back in browser history, with a fallback route where provided. | Generic admin create/edit/view forms; public-page create/edit; monthly contribution file upload; contact-message detail. | `/dashboard/...` create/edit/detail routes, `/dashboard/cms/publicPage-create`, `/dashboard/cms/publicPage-edit/:publicPageId`, `/dashboard/contributions/monthlyContribution-create` file-upload flow, `/dashboard/cms/contactMessage-view/:id`. |
| `KiduReset.tsx` | Resets form state and clears validation errors using supplied initial values/setters. | Generic create/edit forms, modal form, public-page create/edit. | Create/edit forms listed under those components; public-page routes `/dashboard/cms/publicPage-create` and `/dashboard/cms/publicPage-edit/:publicPageId`. |
| `KiduSearchBar.tsx` | Search input that calls the supplied `onSearch` callback. | Admin dashboard homepage and `KiduServerTable`. | `/dashboard` search area; also list pages with table search enabled, e.g. `/dashboard/settings/state-list`. |
| `KiduServerTable.tsx` | Reusable server-paged/sorted table with fetch callback, search, filters, actions, optional export/add controls and row routes. Uses TanStack React Table, React Bootstrap, internal search/button/popup/navbar/loader components. | Used directly by many admin and staff list/detail pages; also embedded in `KiduServerTableList` and lookup popups. | Admin list routes such as `/dashboard/settings/state-list`, `/dashboard/contributions/member-list`, `/dashboard/claims/deathclaims-list`, `/dashboard/cms/dailynews-list`; staff list routes `/staff-portal/contribution-list`, `/staff-portal/refund-list`. |
| `KiduServerTableList.tsx` | Higher-level list wrapper that configures and renders `KiduServerTable` for entity list pages; caller supplies title, columns, fetch and action behavior. | Most admin entity `List.tsx` pages and staff direct-entry/refund list pages. | The corresponding list route. Examples: `/dashboard/settings/yearMaster-list`, `/dashboard/contributions/monthlyContribution-list`, `/dashboard/claims/refundcontribution-list`, `/dashboard/supportTickets-list`, `/staff-portal/contribution-list`, `/staff-portal/refund-list`. |
| `KiduServerTableNavbar.tsx` | Table toolbar for search/filter/export/page-size and additional actions. | Nested inside `KiduServerTable`; also used by member and monthly-contribution detail views. | List routes using `KiduServerTable`, plus `/dashboard/contributions/member-view/:memberId` and `/dashboard/contributions/monthlyContribution-view/:contributionMasterId` where the detail pages render a table toolbar. |
| `KiduTableFilter.tsx` | Filter dropdown that builds text/select/date/number filters and reports filter state through `onFilterChange`. | Nested within table/list/navbar components and used by company list. | List pages with filtering enabled, e.g. `/dashboard/settings/company-list`; additional table routes when their configuration enables filters. |
| `KiduValidation.tsx` | Shared field validation based on rule definitions; returns validation result/error information. | `KiduCreate`, `KiduEdit`, and `KiduCreateModal`. | Indirectly visible on create/edit/modal forms when submitting invalid or incomplete fields. |
| `KiduYearSelector.tsx` | Year dropdown, initialized from a default year and calling `onYearSelect`. | Admin `Layout/Navbar.tsx`, wired to `YearContext`. | In the admin top bar across `/dashboard/...` routes. |

## Admin-specific components — `src/ADMIN-PORTAL/Components/`

| Component | Purpose and what it uses | Where it is used in code | Browser location |
|---|---|---|---|
| `KiduAccountsettingsModal.tsx` | Admin account settings dialog, including the account/password settings UI and service actions. Controlled by `show` and `onHide` props. | `ADMIN-PORTAL/Layout/Navbar.tsx` | Open account settings from the top bar on `/dashboard/...`. |
| `KiduCreate.tsx` | Configurable create form driven by field definitions, initial values, validation rules, event callbacks, optional file/image controls and submit behavior. Uses shared validation, reset, previous and submit components. | Most admin `Create.tsx` pages; public-page and year/expense-type modal flows; staff account settings and staff create flows. | Corresponding create routes: e.g. `/dashboard/settings/state-create`, `/dashboard/contributions/member-create`, `/dashboard/claims/deathclaims-create`, `/dashboard/cms/dailynews-create`, `/dashboard/supportTickets-create`, `/staff-portal/settings`, `/staff-portal/refund-list/MemberRefundContribution-create`. |
| `KiduEdit.tsx` | Configurable record edit form with field definitions, loaded data, validation, update callbacks, optional image/attachment handling, audit-log display and loading state. | Admin entity `Edit.tsx` pages and approval edit screens; staff edit, direct-entry edit and refund edit pages. | Corresponding edit/approval routes, e.g. `/dashboard/settings/state-edit/:stateId`, `/dashboard/contributions/accountDirectEntry-edit/:accountsDirectEntryID`, `/dashboard/claims/deathclaims-approve/:deathClaimId`, `/staff-portal/staff-edit/:memberId`, `/staff-portal/refund-list/MemberRefundContribution-edit/:refundContributionId`. |
| `KiduNavbarDropdown.tsx` | Admin navbar dropdown menu for supplied user/account actions. | `ADMIN-PORTAL/Layout/Navbar.tsx`. | Open the user/menu dropdown in the admin top bar on `/dashboard/...`. |
| `KiduNotificationDropdown.tsx` | Notification dropdown with hard-coded sample notification entries and a link to `/dashboard/notifications`; it does not fetch live notifications in this file. | No current import/usage found. | No current page currently renders this dropdown. `/dashboard/notifications` is a separate routed page, not evidence that this dropdown is mounted. |
| `KiduProfileModal.tsx` | Admin profile dialog, controlled by `show` and `onHide`; displays/edits profile information through its own local/service behavior. | `ADMIN-PORTAL/Layout/Navbar.tsx`. | Open profile from the admin top bar on `/dashboard/...`. |
| `KiduSubmit.tsx` | Reusable submit button with configurable label/loading/disabled state. | `KiduCreate.tsx`; public page create/edit forms. | Indirectly on admin create forms and `/dashboard/cms/publicPage-create` / `/dashboard/cms/publicPage-edit/:publicPageId`. |
| `KiduView.tsx` | Configurable record detail view from field definitions and loaded record data; can show attachments and audit logs and uses loader/previous navigation. | Admin detail pages; staff refund detail page. | Corresponding detail routes, e.g. `/dashboard/settings/state-view/:stateId`, `/dashboard/contributions/member-view/:memberId`, `/dashboard/claims/refundcontribution-view/:refundContributionId`, `/staff-portal/refund-list/MemberRefundContribution-view/:refundContributionId`. |

## Browser route map by page family

These are actual route patterns declared in `src/ADMIN-PORTAL/Routes/Route.tsx` and `src/STAFF-PORTAL/Routes/Routes.tsx`. Replace `:id` placeholders with a real record ID, such as `/dashboard/settings/state-view/1`. Some components render only after clicking a page control.

| Page family | Browser route patterns | Kidu components typically visible |
|---|---|---|
| Admin shell/dashboard | `/dashboard`, `/dashboard/notifications` | `KiduYearSelector`, navbar dropdown, account/profile/logout modal; dashboard card/search/loader components on home. Notification dropdown is not currently mounted. |
| Settings masters | `/dashboard/settings/{branch,category,circle,company,designation,month,reportEngine,reportType,state,status,user,usertype,yearMaster}-{list,create,edit/:id,view/:id}` | `KiduServerTableList`/`KiduServerTable`, `KiduCreate`/`KiduEdit`/`KiduView`, popup/create-modal controls where imported. Route parameter names vary by entity. |
| Contributions | `/dashboard/contributions/{accountDirectEntry,directpayment,member,monthlyContribution}-{list,create,edit/:id,view/:id}` | Tables, create/edit/view forms, attachments, lookup popups; monthly contribution list/detail includes file/report workflows. |
| Claims and refunds | `/dashboard/claims/{deathclaims,refundcontribution}-{list,create,edit/:id,view/:id}` | Tables, generic forms, detail view, attachments; approval routes include `/dashboard/claims/deathclaims-approve/:deathClaimId` and `/dashboard/claims/refundcontribution-approve/:refundContributionId`. |
| CMS/content | `/dashboard/cms/attachments-{list,create,edit/:attachmentId,view/:attachmentId}`, `/dashboard/cms/contactMessage-{list,view/:id}`, `/dashboard/cms/dailynews-{list,create,edit/:dailyNewsId,view/:dailyNewsId}`, `/dashboard/cms/manage-committe-{list,create,edit/:managingComiteeId,view/:managingComiteeId}`, `/dashboard/cms/publicPage-{list,create,edit/:publicPageId,view/:publicPageId}`, `/dashboard/cms/dayquote-{list,create,edit/:dayQuoteId,view/:dayQuoteId}` | Tables, generic create/edit/view, attachments/audit where configured, previous/reset/submit on public-page form. |
| Reports/support | `/dashboard/report-{list,create,edit/:reportId,view/:reportId}`, `/dashboard/supportTickets-{list,create,edit/:supportTicketId,view/:supportTicketId}` | Tables and generic CRUD forms. |
| Expenses/approvals | `/dashboard/administration/expensemaster-{list,create,edit/:expenseMasterId,view/:expenseMasterId}`, `/dashboard/administration/expensetype-{list,create,edit/:id,view/:id}`, `/dashboard/approval-list`, plus contribution/claim approval paths | Tables, create/edit/view forms, approval edit forms, attachment and audit sections where configured. |
| Staff direct contribution | `/staff-portal/contribution-list`, `/staff-portal/contributions/staffaccountDirectEntry-create`, `/staff-portal/contributions/staffaccountDirectEntry-view/:accountsDirectEntryID`, `/staff-portal/contributions/staffaccountDirectEntry-edit/:accountsDirectEntryID` | Server table, create/edit/view and attachment controls where configured. |
| Staff refund/profile | `/staff-portal/refund-list`, `/staff-portal/refund-list/MemberRefundContribution-{create,view/:refundContributionId,edit/:refundContributionId}`, `/staff-portal`, `/staff-portal/staff-edit/:memberId`, `/staff-portal/settings`, `/staff-portal/history` | Tables, forms, loader, navbar/sidebar logout modal. |

Route group patterns above abbreviate families for readability. The concrete route definitions, including exact case and parameter names, are authoritative in the route files cited at the start of this document.

`src/ADMIN-PORTAL/Pages/Settings/UserRoleRight/` has list/create/edit/view components that use Kidu forms and tables, but those pages are not currently registered in `ADMIN-PORTAL/Routes/Route.tsx`; therefore there is no active `/dashboard/...` browser route to open for them.

## Components present but currently unused

The following files are part of the component source but have no active import/consumer found during the scan: `KiduDownload.tsx`, `KiduDropdown.tsx`, `KiduExcelButton.tsx`, `KiduNotes.tsx`, `KiduNotificationDropdown.tsx`. They do not currently appear on an application page unless another part of the project imports them dynamically (no such usage was found).

## Source-of-truth files

- `src/ADMIN-PORTAL/Routes/Route.tsx` — Admin browser paths and role guard.
- `src/STAFF-PORTAL/Routes/Routes.tsx` — Staff browser paths and role guard.
- `src/Routes/AppRoutes.tsx` and `src/App.tsx` — Portal route assembly and router shell.
- Component source files named in the tables — Props, internal state, actions and direct imports.



test git hub 