module.exports  =
{
    name:       "usermanagement",
    methods:
    {
        logonUser:  function(){return {firstName: "System", lastName: "Administrator"};},
        logoffUser: function(){return {firstName: "Guest", lastName: "User"};},
        editUser:   function(){return {id: this.arguments.userId, firstName: "James", lastName: "Doohy"};},
        saveUser:   function(){return user;},
        deleteUser: function(){return "Delete successful.";}
    }
}