import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class TeamService {
    teamList: any = [];
    subProjectList: any = [];

    //constructor (private http: _HttpClient) {
//
//    }

    constructor (private http: HttpClient) {

    }

    createTeam(teamInfo) {
        return this.http
            .post('cgserver/createTeam', {'teamInfo': teamInfo})
            .pipe(catchError(this.handleError));
    }

    deleteTeam(team_id) {
        return this.http
            .post('cgserver/deleteTeam', {'id': team_id})
            .pipe(catchError(this.handleError));
    }

    createProject(project) {
        return this.http
            .post('cgserver/createProject', {'project': project})
            .pipe(catchError(this.handleError));
    }

    deleteProject(project_id) {
        return this.http
            .post('cgserver/deleteProject', {'id': project_id})
            .pipe(catchError(this.handleError));
    }

    createSubProject(subProject) {
        return this.http
            .post('cgserver/createSubProject', {'subProject': subProject})
            .pipe(catchError(this.handleError));
    }

    deleteSubProject(projectName) {
        console.log('projectName =', projectName);
        return this.http
            .post('cgserver/deleteSubProject', {'projectName': projectName})
            .pipe(catchError(this.handleError));
    }

    getTeams(user, role) {
        console.log('getTeams', role);
        if (role === 'super')
            return this.http
                .post('cgserver/getAllTeams', {})
                .pipe(catchError(this.handleError));
        else {
            return this.http
                .post('cgserver/getMyTeams', {'user': user})
                .pipe(catchError(this.handleError));
        }
    }

    getAllTeams() {
        return this.http
            .post('cgserver/getAllTeams', {})
            .pipe(catchError(this.handleError));
    }

    getMyTeams(user) {
        return this.http
            .post('cgserver/getMyTeams', {'user': user})
            .pipe(catchError(this.handleError));
    }

    getProjects(user, role) {
        if (role === 'super')
            return this.http
                .post('cgserver/getAllProjects', {})
                .pipe(catchError(this.handleError));
        else
            return this.http
                .post('cgserver/getMyProjects', {'user': user})
                .pipe(catchError(this.handleError));
    }

    getMyProjects(user) {
        return this.http
            .post('cgserver/getMyProjects', {'user': user})
            .pipe(catchError(this.handleError));
    }

    getAllProjects() {
        return this.http
            .post('cgserver/getAllProjects', {})
            .pipe(catchError(this.handleError));
    }

    getProjectInfo(projectName) {
        return this.http
            .post('cgserver/getProjectInfo', {'projectName': projectName})
            .pipe(catchError(this.handleError));
    }

    getMySubProjects(user) {
        return this.http
            .post('cgserver/getMySubProjects', {'user': user})
            .pipe(catchError(this.handleError));
    }

    getSubProjects(project) {
        return this.http
            .post('cgserver/getSubProjects', {'project': project})
            .pipe(catchError(this.handleError));
    }

    getMyTeamProjects(teamName) {
        return this.http
            .post('cgserver/getMyTeamProjects', {'teamName': teamName})
            .pipe(catchError(this.handleError));
    }

    getMyProjectSubProjects(project) {
        return this.http
            .post('cgserver/getMyProjectSubProjects', {'project': project})
            .pipe(catchError(this.handleError));
    }

    getTemplates(user, role) {
        if (role === 'super')
            return this.http
                .post('cgserver/getAllTemplates', {})
                .pipe(catchError(this.handleError));
        else
            return this.http
                .post('cgserver/getMyTemplates', {'user': user})
                .pipe(catchError(this.handleError));
    }

    getMyTemplates(user) {
        return this.http
            .post('cgserver/getMyTemplates', {'user': user})
            .pipe(catchError(this.handleError));
    }

    createTemplate(template) {
        return this.http
            .post('cgserver/createTemplate', {'template': template})
            .pipe(catchError(this.handleError));
    }

    deleteTemplate(template_id) {
        return this.http
            .post('cgserver/deleteTemplate', {'id': template_id})
            .pipe(catchError(this.handleError));
    }

    setTemplate(templateName, stage) {
        return this.http
            .post('cgserver/setTemplate', {'name': templateName, stage})
            .pipe(catchError(this.handleError));
    }

    testDAMServer(host, port, apiKey) {
        const url = 'http://' + host + ':' + port + '/razuna';
        console.log('url =', url);
        return this.http
            .post('cgserver/testDAMServer', {'url': url, 'apiKey': apiKey})
            .pipe(catchError(this.handleError));
    }

    testSSHServer(url, user, password, DBname) {
        return this.http
            .post('cgserver/testMongoDBServer', {'url': url, 'user': user, 'password': password, 'DBname': DBname})
            .pipe(catchError(this.handleError));
    }

    getUsers(user, role, team) {
        if (role === 'super')
            return this.http
                .post('cgserver/getAllUsers', {})
                .pipe(catchError(this.handleError));
        else
            return this.http
                .post('cgserver/getTeamMember', {'team': team})
                .pipe(catchError(this.handleError));
    }

    getAllUsers() {
        return this.http
            .post('cgserver/getAllUsers', {})
            .pipe(catchError(this.handleError));
    }

    setUserInfo(user) {
        console.log(user);
        return this.http
            .post('cgserver/setUserInfo', {'id': user.id, 'role': user.role, 'alias': user.alias,
                                'team': user.team, 'enable': user.enable})
            .pipe(catchError(this.handleError));
    }

    deleteUser(user_id) {
        return this.http
            .post('cgserver/deleteMyTeamMember', {'id': user_id})
            .pipe(catchError(this.handleError));
    }

    getAllSubProjects() {
        return this.http
            .post('cgserver/getAllSubProjects', {})
            .pipe(catchError(this.handleError));
    }

    setProjectDesignTool(project_id, designTool) {
        return this.http
            .post('cgserver/setProjectDesignTool', {'id': project_id, 'designTool': designTool})
            .pipe(catchError(this.handleError));
    }

    setProjectRender(project_id, render) {
        return this.http
            .post('cgserver/setProjectRender', {'id': project_id, 'render': render})
            .pipe(catchError(this.handleError));
    }

    getUserInfo(user) {
        return this.http
            .post('cgserver/getUserInfo', {'username': user})
            .pipe(catchError(this.handleError));
    }

    getTeam(teamName) {
        return this.http
            .post('cgserver/getTeam', {'name': teamName})
            .pipe(catchError(this.handleError));
    }

    runTeamDocker(teamName) {
        return this.http
            .post('cgserver/runTeamDocker', {'name': teamName})
            .pipe(catchError(this.handleError));
    }

    private handleError (error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        return Observable.throw(error || "Server Error");
    }

    setTeamList(teamList) {
        this.teamList = teamList;
    }

    getTeamList() {
        return this.teamList;
    }

    setSubProjectList(subProjectList) {
        this.subProjectList = subProjectList;
        console.log(this.subProjectList);
    }

    getSubProjectList() {
        console.log(this.subProjectList);
        return this.subProjectList;
    }


}

