import { Contact } from './../interface/contact.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/models/api-response.model';
import { PaymentDetail, UserBooking } from '@core/models/booking.model';
import { Enquiry, UserEnquiry } from '@core/models/enquiry.model';
import { User } from '@core/models/user.model';
import { WorkSpace } from '@core/models/workspace.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUser(): Observable<User> {
    return this.http.get<ApiResponse<User>>('/user/profile').pipe(map(user => user.data));
  }

  updateUser(user: User) {
    return this.http.put<User>('/user/update', user);
  }

  // For Logged In user
  createEnquiry(userPayload: Enquiry) {
    return this.http.post<ApiResponse<Enquiry>>('/user/enquiry', userPayload);
  }

  createLead(userPayload) {
    return this.http.post<ApiResponse<Enquiry>>('/user/enquiry/lead', userPayload);
  }

  // For not Logged In user
  createEnquiryNonUser(userPayload: Enquiry) {
    return this.http.post<ApiResponse<Enquiry>>('/user/enquiryWithoutLogin', userPayload);
  }

  // For Non Logged In user
  addUserEnquiry(userPayload: Enquiry) {
    return this.http.post<ApiResponse<User>>('/user/create', userPayload);
  }

  getBookings(): Observable<UserBooking[]> {
    return this.http.get<ApiResponse<UserBooking[]>>('/user/bookings').pipe(map(bookings => bookings.data));
  }

  getEnquires(): Observable<UserEnquiry[]> {
    return this.http.get<ApiResponse<UserEnquiry[]>>('/user/enquiries').pipe(map(user => user.data));
  }

  getPayments(): Observable<PaymentDetail[]> {
    return this.http.get<ApiResponse<PaymentDetail[]>>('/user/payments').pipe(map(user => user.data));
  }

  addToFavorite(workSpaceId: string, is_interested: boolean) {
    const favPayload = { workSpaceId, is_interested };
    return this.http
      .post<ApiResponse<WorkSpace>>('/user/workspace/like', favPayload)
      .pipe(map(updatedWorkspace => updatedWorkspace.data));
  }

  getFavorites(): Observable<WorkSpace[]> {
    return this.http.get<ApiResponse<WorkSpace[]>>('/user/workspace/favourite').pipe(
      map(workspaces => {
        // we modify the response to display starting price & price type
        const allWorkspaces: WorkSpace[] = workspaces.data.map(workspace => this.setStartingPrice(workspace));
        return allWorkspaces;
      }),
    );
  }

  setStartingPrice(workspace: WorkSpace) {
    const sortedPlanByPrice = workspace.plans.sort((a, b) => a.price - b.price);
    const updatedWorkspace = workspace;
    workspace.starting_price = sortedPlanByPrice[0].price;
    workspace.price_type = sortedPlanByPrice[0].duration;
    return updatedWorkspace;
  }

  addToContact(contactPayload: Contact) {
    return this.http.post<Contact>('/user/contactUs', contactPayload);
  }
}
